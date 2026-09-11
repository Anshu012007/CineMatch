import { Router } from "express";
import { tmdbService } from "../services/tmdbService.js";
import { getMoodGenres } from "../services/moodMapping.js";
import { TMDB_GENRES } from "../data/mockMovies.js";

const router = Router();

// POST /api/recommendations/group
router.post("/match", async (req, res) => {
  try {
    const { members } = req.body;

    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: "Members array is required" });
    }

    // 1. Gather all requested genres and all dealbreaker genres
    const memberGenreMap = new Map();
    const allDealbreakers = new Set();
    const allDesiredGenres = new Set();

    members.forEach((m, idx) => {
      const userDesired = new Set([...(m.genres || [])]);
      if (m.mood) {
        const moodG = getMoodGenres(m.mood);
        moodG.forEach(g => userDesired.add(g));
      }

      memberGenreMap.set(m.name || `Member ${idx + 1}`, userDesired);
      userDesired.forEach(g => allDesiredGenres.add(g));

      (m.dealbreakers || []).forEach(d => allDealbreakers.add(Number(d)));
    });

    // 2. Discover candidates with desired genres
    const desiredGenreArray = Array.from(allDesiredGenres);
    const discoverRes = await tmdbService.discoverMovies({
      genreIds: desiredGenreArray.slice(0, 5),
      minRating: 6.5,
      sortBy: "popularity.desc"
    });

    let candidates = discoverRes.results || [];
    if (candidates.length < 5) {
      const trending = await tmdbService.getTrending("week");
      candidates = [...candidates, ...trending.results];
    }

    // De-duplicate
    candidates = candidates.filter((m, i, a) => a.findIndex(t => t.id === m.id) === i);

    // 3. Score candidates for the group
    const scoredMovies = candidates
      .map(movie => {
        const movieGenreIds = movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []);

        // Check if any dealbreakers are violated
        const violatedDealbreaker = movieGenreIds.find(g => allDealbreakers.has(g));
        if (violatedDealbreaker) {
          return null; // Excluded entirely
        }

        // Count members satisfied
        let satisfiedMembers = [];
        let unsatisfiedMembers = [];

        members.forEach((m, idx) => {
          const name = m.name || `Member ${idx + 1}`;
          const desired = memberGenreMap.get(name);
          const hasMatch = movieGenreIds.some(gid => desired.has(gid));

          if (hasMatch) {
            satisfiedMembers.push(name);
          } else {
            unsatisfiedMembers.push(name);
          }
        });

        const satisfactionRatio = members.length > 0 ? satisfiedMembers.length / members.length : 1;
        const baseScore = Math.round(satisfactionRatio * 80);
        const ratingBonus = Math.min(20, Math.round((movie.vote_average || 7) * 2));
        const compatibilityScore = Math.min(100, Math.max(50, baseScore + ratingBonus));

        // Format genre names
        const genreNames = movieGenreIds
          .map(id => TMDB_GENRES.find(g => g.id === id)?.name)
          .filter(Boolean)
          .slice(0, 3);

        const matchReason =
          satisfiedMembers.length === members.length
            ? `Perfect match! Matches preferences for everyone in your group (${satisfiedMembers.join(", ")}).`
            : `Strong consensus pick: satisfies ${satisfiedMembers.join(", ")} with top-rated ${genreNames.join("/")}.`;

        return {
          ...movie,
          compatibilityScore,
          satisfiedMembers,
          unsatisfiedMembers,
          matchReason
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({
      groupSize: members.length,
      excludedDealbreakers: Array.from(allDealbreakers).map(id => TMDB_GENRES.find(g => g.id === id)?.name || id),
      matches: scoredMovies.slice(0, 10)
    });
  } catch (err) {
    console.error("Group matching error:", err);
    res.status(500).json({ error: "Failed to calculate group recommendations", message: err.message });
  }
});

export default router;
