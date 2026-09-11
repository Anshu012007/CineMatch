// Frontend API client communicating with Express backend

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function fetchJson(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || errorBody.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const movieApi = {
  // 1. Trending movies
  getTrending: (timeWindow = "week") => 
    fetchJson(`/movies/trending?timeWindow=${timeWindow}`),

  // 2. Top rated movies
  getTopRated: (page = 1) => 
    fetchJson(`/movies/top-rated?page=${page}`),

  // 3. Movie details by ID (with videos, credits, recommendations)
  getMovieDetails: (id) => 
    fetchJson(`/movies/${id}`),

  // 4. Live search
  search: (query, page = 1) => 
    fetchJson(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`),

  // 5. Genres list
  getGenres: () => 
    fetchJson("/movies/genres"),

  // 6. Mood list
  getMoods: () => 
    fetchJson("/movies/moods"),

  // 7. Discover movies with filters
  discover: ({ genres = [], mood = "", minRating = 0, sortBy = "popularity.desc", page = 1 } = {}) => {
    const params = new URLSearchParams();
    if (genres && genres.length > 0) params.set("genres", genres.join(","));
    if (mood) params.set("mood", mood);
    if (minRating) params.set("minRating", minRating);
    if (sortBy) params.set("sortBy", sortBy);
    if (page) params.set("page", page);

    return fetchJson(`/movies/discover?${params.toString()}`);
  },

  // 8. Surprise Me random movie
  getSurprise: ({ mood = "", genreId = "" } = {}) => {
    const params = new URLSearchParams();
    if (mood) params.set("mood", mood);
    if (genreId) params.set("genreId", genreId);
    return fetchJson(`/movies/surprise?${params.toString()}`);
  },

  // 9. Recommendations by movie ID
  getRecommendations: (movieId) => 
    fetchJson(`/movies/recommendations/${movieId}`),

  // 10. Phase 2: AI Movie Assistant chat
  aiChat: (prompt) => 
    fetchJson("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ prompt })
    }),

  // 11. Phase 2: Group recommendation matching
  groupMatch: (members) => 
    fetchJson("/recommendations/group/match", {
      method: "POST",
      body: JSON.stringify({ members })
    })
};
