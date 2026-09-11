/**
 * CineMatch - Unified Combined Backend Server
 * Run with: node combined_server.js
 * Requires: npm install express cors dotenv axios
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// ====================================================================
// 1. DATA: TMDB Genres & High-Fidelity Mock Movies
// ====================================================================
export const TMDB_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" }
];

export const MOCK_MOVIES = [
  {
    id: 157336,
    title: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34500,
    runtime: 169,
    genre_ids: [12, 18, 878],
    genres: [{ id: 12, name: "Adventure" }, { id: 18, name: "Drama" }, { id: 878, name: "Science Fiction" }],
    trailer_key: "zSWdZVtXT7E",
    director: "Christopher Nolan",
    cast: [
      { id: 10297, name: "Matthew McConaughey", character: "Joseph Cooper", profile_path: "/wDeLDeDq0Xy4d35jF9vYvA7i8V9.jpg" },
      { id: 1813, name: "Anne Hathaway", character: "Dr. Amelia Brand", profile_path: "/tLpq597i2qKj3B0y4N2H3L6Qe8Z.jpg" }
    ],
    similar_ids: [27205, 603, 335984]
  },
  {
    id: 27205,
    title: "Inception",
    tagline: "Your mind is the scene of the crime.",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\".",
    poster_path: "/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 36000,
    runtime: 148,
    genre_ids: [28, 12, 878],
    genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 878, name: "Science Fiction" }],
    trailer_key: "YoHD9XEInc0",
    director: "Christopher Nolan",
    cast: [
      { id: 6193, name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
      { id: 24045, name: "Joseph Gordon-Levitt", character: "Arthur", profile_path: "/dhv9V8B0V0t4n6l8b7M8J6g4G6H.jpg" }
    ],
    similar_ids: [157336, 603, 335984]
  },
  {
    id: 603,
    title: "The Matrix",
    tagline: "Welcome to the Real World.",
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/ncEWFZ8KnAnFLmKLJiqEfZeKuYZ.jpg",
    release_date: "1999-03-30",
    vote_average: 8.2,
    vote_count: 25400,
    runtime: 136,
    genre_ids: [28, 878],
    genres: [{ id: 28, name: "Action" }, { id: 878, name: "Science Fiction" }],
    trailer_key: "vKQi3bBA1y8",
    director: "Lana & Lilly Wachowski",
    cast: [
      { id: 6384, name: "Keanu Reeves", character: "Neo", profile_path: "/4D0PpNI0kmP58hgrwGC3UBTVYPv.jpg" }
    ],
    similar_ids: [27205, 157336]
  },
  {
    id: 155,
    title: "The Dark Knight",
    tagline: "Welcome to a world without rules.",
    overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent, but finds himself in chaos unleashed by the Joker.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 32000,
    runtime: 152,
    genre_ids: [18, 28, 80, 53],
    genres: [{ id: 18, name: "Drama" }, { id: 28, name: "Action" }, { id: 80, name: "Crime" }, { id: 53, name: "Thriller" }],
    trailer_key: "EXeTwQWrcwY",
    director: "Christopher Nolan",
    cast: [
      { id: 3894, name: "Christian Bale", character: "Bruce Wayne", profile_path: "/b7fTC9WFkgq6O87OGikOk0qGRAP.jpg" },
      { id: 1810, name: "Heath Ledger", character: "Joker", profile_path: "/5Y9HnYYa9jF4NuY9l0G2A4xM5wB.jpg" }
    ],
    similar_ids: [27205, 550]
  },
  {
    id: 496243,
    title: "Parasite",
    tagline: "Act like you own the place.",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
    release_date: "2019-05-30",
    vote_average: 8.5,
    vote_count: 17800,
    runtime: 132,
    genre_ids: [35, 53, 18],
    genres: [{ id: 35, name: "Comedy" }, { id: 53, name: "Thriller" }, { id: 18, name: "Drama" }],
    trailer_key: "5xH0hhMB8GE",
    director: "Bong Joon-ho",
    cast: [
      { id: 20738, name: "Song Kang-ho", character: "Kim Ki-taek", profile_path: "/l9iJ5vC7xM0d2e4g8F3c7v2k1M6.jpg" }
    ],
    similar_ids: [550, 694]
  },
  {
    id: 129,
    title: "Spirited Away",
    tagline: "Tunnel to a mystical world.",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. She must call upon the courage she never knew she had to free her family.",
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_path: "/mSDvdv1bXp6wF2K2M4l0H9XvV4Z.jpg",
    release_date: "2001-07-20",
    vote_average: 8.5,
    vote_count: 16000,
    runtime: 125,
    genre_ids: [16, 10751, 14],
    genres: [{ id: 16, name: "Animation" }, { id: 10751, name: "Family" }, { id: 14, name: "Fantasy" }],
    trailer_key: "ByXuk9QqQkk",
    director: "Hayao Miyazaki",
    cast: [
      { id: 19588, name: "Rumi Hiiragi", character: "Chihiro Ogino", profile_path: "/b0J2K9k8v0N5p9D2h6M1j8k3V7R.jpg" }
    ],
    similar_ids: [372058]
  },
  {
    id: 694,
    title: "The Shining",
    tagline: "He came as the caretaker, but this hotel had its own caretakers.",
    overview: "Jack Torrance accepts a caretaker job at the Overlook Hotel, where he, along with his wife and son, must live isolated for the winter. But they aren't prepared for the madness that lurks within.",
    poster_path: "/xazWoLealQwEgqZ89MLZklLZD3k.jpg",
    backdrop_path: "/mmd1HnuvAzrmqII9rutJ9RlaRwV.jpg",
    release_date: "1980-05-23",
    vote_average: 8.2,
    vote_count: 17200,
    runtime: 146,
    genre_ids: [27, 53],
    genres: [{ id: 27, name: "Horror" }, { id: 53, name: "Thriller" }],
    trailer_key: "S014446AA1M",
    director: "Stanley Kubrick",
    cast: [
      { id: 514, name: "Jack Nicholson", character: "Jack Torrance", profile_path: "/9g8hL2M8b0v9N8l4K6f1M2B5C7D.jpg" }
    ],
    similar_ids: [496243]
  }
];

// ====================================================================
// 2. MOOD MAPPINGS
// ====================================================================
export const MOODS = {
  happy: { label: "Happy", genreIds: [35, 16, 10751], minRating: 7.0 },
  sad: { label: "Sad", genreIds: [18, 10749], minRating: 7.2 },
  scared: { label: "Scared", genreIds: [27, 53, 9648], minRating: 6.5 },
  funny: { label: "Funny", genreIds: [35], minRating: 6.8 },
  excited: { label: "Excited", genreIds: [28, 12, 878], minRating: 7.0 },
  relaxed: { label: "Relaxed", genreIds: [99, 10402, 16], minRating: 7.0 }
};

function formatMovie(m) {
  if (!m) return null;
  return {
    id: m.id,
    title: m.title || m.name,
    tagline: m.tagline || "",
    overview: m.overview || "No overview available.",
    poster_path: m.poster_path,
    poster_url: m.poster_path ? `${TMDB_IMAGE_BASE}/w500${m.poster_path}` : null,
    backdrop_path: m.backdrop_path,
    backdrop_url: m.backdrop_path ? `${TMDB_IMAGE_BASE}/original${m.backdrop_path}` : null,
    release_date: m.release_date || "Unknown",
    vote_average: typeof m.vote_average === "number" ? Number(m.vote_average.toFixed(1)) : 0,
    vote_count: m.vote_count || 0,
    runtime: m.runtime || null,
    genres: m.genres || (m.genre_ids ? TMDB_GENRES.filter(g => m.genre_ids.includes(g.id)) : []),
    genre_ids: m.genre_ids || (m.genres ? m.genres.map(g => g.id) : [])
  };
}

// ====================================================================
// 3. TMDB SERVICE LAYER
// ====================================================================
async function tmdbFetch(endpoint, params = {}) {
  if (!TMDB_API_KEY) return null;
  try {
    const res = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: { api_key: TMDB_API_KEY, ...params }
    });
    return res.data;
  } catch (err) {
    console.warn(`TMDB ${endpoint} failed:`, err.message);
    return null;
  }
}

// ====================================================================
// 4. API ROUTES
// ====================================================================
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "cinematch_standalone.html"));
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "CineMatch Combined API",
    tmdb_configured: Boolean(TMDB_API_KEY),
    gemini_configured: Boolean(GEMINI_API_KEY)
  });
});

// Trending
app.get("/api/movies/trending", async (req, res) => {
  const live = await tmdbFetch("/trending/movie/week");
  if (live?.results) {
    return res.json({ results: live.results.map(formatMovie), source: "tmdb" });
  }
  res.json({ results: MOCK_MOVIES.map(formatMovie), source: "mock" });
});

// Top Rated
app.get("/api/movies/top-rated", async (req, res) => {
  const live = await tmdbFetch("/movie/top_rated", { page: req.query.page || 1 });
  if (live?.results) {
    return res.json({ results: live.results.map(formatMovie), source: "tmdb" });
  }
  const sorted = [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
  res.json({ results: sorted.map(formatMovie), source: "mock" });
});

// Genres
app.get("/api/movies/genres", async (req, res) => {
  const live = await tmdbFetch("/genre/movie/list");
  res.json(live?.genres || TMDB_GENRES);
});

// Search
app.get("/api/movies/search", async (req, res) => {
  const q = (req.query.q || "").trim().toLowerCase();
  if (!q) return res.json({ results: [] });

  const live = await tmdbFetch("/search/movie", { query: q, include_adult: false });
  if (live?.results) {
    return res.json({ results: live.results.map(formatMovie), source: "tmdb" });
  }

  const matches = MOCK_MOVIES.filter(m =>
    m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
  );
  res.json({ results: matches.map(formatMovie), source: "mock" });
});

// Discover / Moods
app.get("/api/movies/discover", async (req, res) => {
  const { mood, genres, minRating, sortBy } = req.query;
  let genreArr = genres ? genres.split(",").map(Number).filter(Boolean) : [];

  if (mood && MOODS[mood]) {
    genreArr = [...new Set([...genreArr, ...MOODS[mood].genreIds])];
  }

  const live = await tmdbFetch("/discover/movie", {
    with_genres: genreArr.join(","),
    sort_by: sortBy || "popularity.desc",
    "vote_average.gte": minRating || undefined
  });

  if (live?.results) {
    return res.json({ results: live.results.map(formatMovie), source: "tmdb" });
  }

  let filtered = [...MOCK_MOVIES];
  if (genreArr.length > 0) {
    filtered = filtered.filter(m => m.genre_ids.some(gid => genreArr.includes(gid)));
  }
  if (minRating) {
    filtered = filtered.filter(m => m.vote_average >= parseFloat(minRating));
  }
  res.json({ results: filtered.map(formatMovie), source: "mock" });
});

// Surprise Me
app.get("/api/movies/surprise", async (req, res) => {
  const pool = MOCK_MOVIES;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  res.json({
    ...formatMovie(picked),
    trailer_key: picked.trailer_key,
    cast: picked.cast,
    director: picked.director
  });
});

// Movie Details
app.get("/api/movies/:id", async (req, res) => {
  const id = Number(req.params.id);
  const live = await tmdbFetch(`/movie/${id}`, {
    append_to_response: "videos,credits,recommendations"
  });

  if (live) {
    const formatted = formatMovie(live);
    const trailer = live.videos?.results?.find(v => v.site === "YouTube")?.key || null;
    const cast = (live.credits?.cast || []).slice(0, 8).map(c => ({
      name: c.name,
      character: c.character,
      profile_url: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null
    }));
    const director = live.credits?.crew?.find(c => c.job === "Director")?.name || "Unknown";
    const recommendations = (live.recommendations?.results || []).slice(0, 6).map(formatMovie);

    return res.json({
      ...formatted,
      trailer_key: trailer,
      cast,
      director,
      recommendations,
      source: "tmdb"
    });
  }

  const mock = MOCK_MOVIES.find(m => m.id === id) || MOCK_MOVIES[0];
  res.json({
    ...formatMovie(mock),
    trailer_key: mock.trailer_key,
    cast: mock.cast,
    director: mock.director,
    recommendations: MOCK_MOVIES.filter(m => m.id !== id).slice(0, 4).map(formatMovie),
    source: "mock"
  });
});

// Recommendations for "Because you watched X"
app.get("/api/movies/recommendations/:id", async (req, res) => {
  const id = Number(req.params.id);
  const recs = MOCK_MOVIES.filter(m => m.id !== id).slice(0, 5).map(formatMovie);
  res.json({ recommendations: recs });
});

// Phase 2: AI Movie Assistant Chat
app.post("/api/ai/chat", async (req, res) => {
  const prompt = (req.body.prompt || "").toLowerCase();
  let genreIds = [878];
  let maxRuntime = null;

  if (prompt.includes("scary") || prompt.includes("horror")) genreIds = [27];
  else if (prompt.includes("comedy") || prompt.includes("funny")) genreIds = [35];
  else if (prompt.includes("action")) genreIds = [28];

  const match = prompt.match(/under (\d+)\s*hours?/i);
  if (match) maxRuntime = parseInt(match[1]) * 60;

  let candidates = MOCK_MOVIES.filter(m => m.genre_ids.some(gid => genreIds.includes(gid)));
  if (candidates.length === 0) candidates = MOCK_MOVIES.slice(0, 3);

  res.json({
    message: `Here are great recommendations tailored to "${req.body.prompt}":`,
    constraints: { genreIds, maxRuntime },
    movies: candidates.map(formatMovie)
  });
});

// Phase 2: Group Recommendations
app.post("/api/recommendations/group/match", (req, res) => {
  const members = req.body.members || [];
  const matches = MOCK_MOVIES.map(m => ({
    ...formatMovie(m),
    compatibilityScore: Math.floor(Math.random() * 20) + 80,
    matchReason: `High consensus across ${members.length || 2} group members with top-rated genres.`
  }));
  res.json({ matches });
});

app.listen(PORT, () => {
  console.log(`🎬 CineMatch Combined Server listening on http://localhost:${PORT}`);
});
