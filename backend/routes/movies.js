import { Router } from "express";
import { tmdbService } from "../services/tmdbService.js";
import { getAllMoods, MOOD_CONFIG } from "../services/moodMapping.js";

const router = Router();

// GET /api/movies/trending
router.get("/trending", async (req, res) => {
  try {
    const timeWindow = req.query.timeWindow === "day" ? "day" : "week";
    const data = await tmdbService.getTrending(timeWindow);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending movies", message: err.message });
  }
});

// GET /api/movies/top-rated
router.get("/top-rated", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.getTopRated(page);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top rated movies", message: err.message });
  }
});

// GET /api/movies/genres
router.get("/genres", async (req, res) => {
  try {
    const genres = await tmdbService.getGenres();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch genres", message: err.message });
  }
});

// GET /api/movies/moods
router.get("/moods", (req, res) => {
  res.json(getAllMoods());
});

// GET /api/movies/search?q=...&page=...
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const data = await tmdbService.searchMovies(query, page);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to search movies", message: err.message });
  }
});

// GET /api/movies/discover
router.get("/discover", async (req, res) => {
  try {
    const genreIds = req.query.genres ? req.query.genres.split(",").map(Number).filter(Boolean) : [];
    const mood = req.query.mood || null;
    const minRating = parseFloat(req.query.minRating) || 0;
    const sortBy = req.query.sortBy || "popularity.desc";
    const page = parseInt(req.query.page) || 1;

    const data = await tmdbService.discoverMovies({
      genreIds,
      mood,
      minRating,
      sortBy,
      page
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to discover movies", message: err.message });
  }
});

// GET /api/movies/surprise
router.get("/surprise", async (req, res) => {
  try {
    const mood = req.query.mood || null;
    const genreId = req.query.genreId || null;
    const movie = await tmdbService.getSurpriseMovie({ mood, genreId });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Failed to get surprise movie", message: err.message });
  }
});

// GET /api/movies/recommendations/:id
router.get("/recommendations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await tmdbService.getRecommendations(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recommendations", message: err.message });
  }
});

// GET /api/movies/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await tmdbService.getMovieDetails(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie details", message: err.message });
  }
});

export default router;
