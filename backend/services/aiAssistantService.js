import axios from "axios";
import { tmdbService } from "./tmdbService.js";
import { TMDB_GENRES } from "../data/mockMovies.js";

class AiAssistantService {
  constructor() {
    this.geminiKey = process.env.GEMINI_API_KEY || "";
  }

  // Fallback rule-based NLP extraction when no LLM key is configured
  extractRulesFromPrompt(prompt) {
    const text = prompt.toLowerCase();
    const result = {
      genreIds: [],
      maxRuntime: null,
      minRating: 7.0,
      keywords: [],
      reasoning: ""
    };

    // Runtime extraction e.g. "under 2 hours", "under 90 mins", "less than 120 minutes"
    const hourMatch = text.match(/under (\d+)\s*hours?/i) || text.match(/less than (\d+)\s*hours?/i);
    if (hourMatch) {
      result.maxRuntime = parseInt(hourMatch[1]) * 60;
    } else {
      const minMatch = text.match(/under (\d+)\s*(?:mins|minutes)/i) || text.match(/less than (\d+)\s*(?:mins|minutes)/i);
      if (minMatch) {
        result.maxRuntime = parseInt(minMatch[1]);
      }
    }

    // Genre extraction
    if (text.includes("scary") || text.includes("horror") || text.includes("creepy") || text.includes("spooky")) {
      result.genreIds.push(27); // Horror
      result.reasoning = "Looking for chills and spine-tingling suspense";
    }
    if (text.includes("sci-fi") || text.includes("space") || text.includes("futuristic") || text.includes("alien") || text.includes("interstellar")) {
      result.genreIds.push(878); // Sci-Fi
      result.reasoning += (result.reasoning ? " with " : "Focusing on ") + "mind-bending sci-fi themes";
    }
    if (text.includes("funny") || text.includes("comedy") || text.includes("laugh") || text.includes("hilarious")) {
      result.genreIds.push(35); // Comedy
      result.reasoning += (result.reasoning ? " and " : "Focusing on ") + "great humor and lighthearted laughs";
    }
    if (text.includes("action") || text.includes("fight") || text.includes("explosion") || text.includes("thrill")) {
      result.genreIds.push(28); // Action
    }
    if (text.includes("animated") || text.includes("anime") || text.includes("cartoon") || text.includes("ghibli")) {
      result.genreIds.push(16); // Animation
    }
    if (text.includes("mystery") || text.includes("detective") || text.includes("whodunit")) {
      result.genreIds.push(9648); // Mystery
    }
    if (text.includes("romantic") || text.includes("love story") || text.includes("date night")) {
      result.genreIds.push(10749); // Romance
    }

    // Default if no genre detected
    if (result.genreIds.length === 0) {
      result.genreIds = [878, 12, 18]; // Sci-Fi / Adventure / Drama
      result.reasoning = "Curating critically acclaimed cinematic picks tailored to your vibe";
    }

    return result;
  }

  // Use Gemini API if key is present
  async queryGemini(prompt) {
    if (!this.geminiKey) return null;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`;
      const systemInstruction = `You are CineMatch AI, an expert cinematic curator. 
A user asks for movie recommendations. Analyze their request and extract movie filters into strict JSON format with these keys:
{
  "genreIds": [number], (TMDB genre ids: Action:28, Adventure:12, Animation:16, Comedy:35, Crime:80, Documentary:99, Drama:18, Family:10751, Fantasy:14, Horror:27, Mystery:9648, Romance:10749, SciFi:878, Thriller:53)
  "maxRuntime": number or null (in minutes),
  "minRating": number (e.g. 7.0),
  "message": "A friendly 1-2 sentence conversational reply explaining why these picks match what they asked for.",
  "specificTitles": ["optional specific movie titles that match perfectly"]
}`;

      const body = {
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemInstruction}\n\nUser request: "${prompt}"\n\nProvide JSON response only.` }]
          }
        ]
      };

      const res = await axios.post(url, body, { headers: { "Content-Type": "application/json" } });
      const candidate = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidate) return null;

      const cleanJson = candidate.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local heuristic:", err.message);
      return null;
    }
  }

  async processChat(userPrompt) {
    let constraints = null;

    if (this.geminiKey) {
      constraints = await this.queryGemini(userPrompt);
    }

    if (!constraints) {
      const heuristic = this.extractRulesFromPrompt(userPrompt);
      constraints = {
        genreIds: heuristic.genreIds,
        maxRuntime: heuristic.maxRuntime,
        minRating: heuristic.minRating,
        message: `Here are recommendations tailored to your request${heuristic.reasoning ? ` (${heuristic.reasoning})` : ""}${heuristic.maxRuntime ? ` keeping it under ${heuristic.maxRuntime} minutes` : ""}:`,
        specificTitles: []
      };
    }

    // Query TMDB with extracted constraints
    let movieResults = [];

    // If specific titles were picked by Gemini, try to search them first
    if (constraints.specificTitles && constraints.specificTitles.length > 0) {
      for (const title of constraints.specificTitles.slice(0, 3)) {
        const search = await tmdbService.searchMovies(title);
        if (search.results && search.results.length > 0) {
          movieResults.push(search.results[0]);
        }
      }
    }

    // Supplement or fill with discover
    if (movieResults.length < 4) {
      const discover = await tmdbService.discoverMovies({
        genreIds: constraints.genreIds || [],
        minRating: constraints.minRating || 7.0,
        sortBy: "popularity.desc"
      });

      let candidates = discover.results || [];
      if (constraints.maxRuntime) {
        // filter out movies longer than maxRuntime if runtime is known
        candidates = candidates.filter(m => !m.runtime || m.runtime <= constraints.maxRuntime);
      }

      for (const cand of candidates) {
        if (!movieResults.some(m => m.id === cand.id)) {
          movieResults.push(cand);
        }
        if (movieResults.length >= 6) break;
      }
    }

    // Fallback if still empty
    if (movieResults.length === 0) {
      const trending = await tmdbService.getTrending("week");
      movieResults = trending.results.slice(0, 4);
    }

    return {
      message: constraints.message || "Here are great movies matching your criteria:",
      constraints: {
        genreIds: constraints.genreIds,
        maxRuntime: constraints.maxRuntime,
        minRating: constraints.minRating
      },
      movies: movieResults
    };
  }
}

export const aiAssistantService = new AiAssistantService();
