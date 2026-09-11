import axios from "axios";
import { MOCK_MOVIES, TMDB_GENRES } from "../data/mockMovies.js";
import { getMoodGenres } from "./moodMapping.js";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

class TmdbService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || "";
    this.isLive = Boolean(this.apiKey && this.apiKey.trim() !== "");
  }

  getHeaders() {
    return {
      accept: "application/json"
    };
  }

  // Format image URLs for frontend convenience
  formatMovie(movie) {
    if (!movie) return null;
    return {
      id: movie.id,
      title: movie.title || movie.name,
      tagline: movie.tagline || "",
      overview: movie.overview || "No overview available.",
      poster_path: movie.poster_path,
      poster_url: movie.poster_path ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` : null,
      backdrop_path: movie.backdrop_path,
      backdrop_url: movie.backdrop_path ? `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}` : null,
      release_date: movie.release_date || movie.first_air_date || "Unknown",
      vote_average: typeof movie.vote_average === "number" ? Number(movie.vote_average.toFixed(1)) : 0,
      vote_count: movie.vote_count || 0,
      runtime: movie.runtime || null,
      genres: movie.genres || (movie.genre_ids ? TMDB_GENRES.filter(g => movie.genre_ids.includes(g.id)) : []),
      genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : [])
    };
  }

  // 1. Trending Movies
  async getTrending(timeWindow = "week") {
    if (this.isLive) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/${timeWindow}`, {
          params: { api_key: this.apiKey },
          headers: this.getHeaders()
        });
        return {
          results: (response.data.results || []).map(m => this.formatMovie(m)),
          page: response.data.page,
          total_pages: response.data.total_pages,
          source: "tmdb"
        };
      } catch (err) {
        console.warn("TMDB live API call failed, falling back to mock data:", err.message);
      }
    }

    // Fallback: mock movies sorted by vote count / popularity
    const sorted = [...MOCK_MOVIES].sort((a, b) => b.vote_count - a.vote_count);
    return {
      results: sorted.map(m => this.formatMovie(m)),
      page: 1,
      total_pages: 1,
      source: "mock"
    };
  }

  // 2. Top Rated Movies
  async getTopRated(page = 1) {
    if (this.isLive) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
          params: { api_key: this.apiKey, page },
          headers: this.getHeaders()
        });
        return {
          results: (response.data.results || []).map(m => this.formatMovie(m)),
          page: response.data.page,
          total_pages: response.data.total_pages,
          source: "tmdb"
        };
      } catch (err) {
        console.warn("TMDB live top-rated call failed, falling back to mock data:", err.message);
      }
    }

    const sorted = [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
    return {
      results: sorted.map(m => this.formatMovie(m)),
      page: 1,
      total_pages: 1,
      source: "mock"
    };
  }

  // 3. Movie Details (with videos, cast, recommendations)
  async getMovieDetails(id) {
    const numericId = Number(id);

    if (this.isLive) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${numericId}`, {
          params: {
            api_key: this.apiKey,
            append_to_response: "videos,credits,recommendations,similar"
          },
          headers: this.getHeaders()
        });

        const raw = response.data;
        const formatted = this.formatMovie(raw);

        // Extract trailer
        const videos = raw.videos?.results || [];
        const trailer = videos.find(v => v.site === "YouTube" && v.type === "Trailer") || videos.find(v => v.site === "YouTube") || null;

        // Extract director and main cast
        const cast = (raw.credits?.cast || []).slice(0, 12).map(c => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profile_path: c.profile_path,
          profile_url: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null
        }));

        const crew = raw.credits?.crew || [];
        const director = crew.find(c => c.job === "Director")?.name || "Unknown";

        // Recommendations & Similar
        const recommendations = [
          ...(raw.recommendations?.results || []),
          ...(raw.similar?.results || [])
        ]
          .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
          .slice(0, 12)
          .map(m => this.formatMovie(m));

        return {
          ...formatted,
          trailer_key: trailer?.key || null,
          director,
          cast,
          recommendations,
          source: "tmdb"
        };
      } catch (err) {
        console.warn(`TMDB details call failed for ID ${id}, falling back to mock:`, err.message);
      }
    }

    // Fallback search in mock data
    const mock = MOCK_MOVIES.find(m => m.id === numericId) || MOCK_MOVIES[0];
    const similarMovies = MOCK_MOVIES.filter(m => (mock.similar_ids || []).includes(m.id)).map(m => this.formatMovie(m));

    return {
      ...this.formatMovie(mock),
      trailer_key: mock.trailer_key,
      director: mock.director || "Acclaimed Filmmaker",
      cast: (mock.cast || []).map(c => ({
        ...c,
        profile_url: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null
      })),
      recommendations: similarMovies.length > 0 ? similarMovies : MOCK_MOVIES.slice(0, 6).map(m => this.formatMovie(m)),
      source: "mock"
    };
  }

  // 4. Search Movies
  async searchMovies(query, page = 1) {
    if (!query || query.trim() === "") {
      return { results: [], page: 1, total_pages: 0, source: "none" };
    }

    if (this.isLive) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
          params: {
            api_key: this.apiKey,
            query: query.trim(),
            page,
            include_adult: false
          },
          headers: this.getHeaders()
        });

        return {
          results: (response.data.results || []).map(m => this.formatMovie(m)),
          page: response.data.page,
          total_pages: response.data.total_pages,
          total_results: response.data.total_results,
          source: "tmdb"
        };
      } catch (err) {
        console.warn("TMDB search call failed, falling back to mock search:", err.message);
      }
    }

    const q = query.toLowerCase().trim();
    const matches = MOCK_MOVIES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.overview.toLowerCase().includes(q) ||
      (m.director && m.director.toLowerCase().includes(q)) ||
      (m.cast && m.cast.some(c => c.name.toLowerCase().includes(q)))
    );

    return {
      results: matches.map(m => this.formatMovie(m)),
      page: 1,
      total_pages: 1,
      total_results: matches.length,
      source: "mock"
    };
  }

  // 5. Genre List
  async getGenres() {
    if (this.isLive) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
          params: { api_key: this.apiKey },
          headers: this.getHeaders()
        });
        return response.data.genres || TMDB_GENRES;
      } catch (err) {
        console.warn("TMDB genres call failed, returning cached genres:", err.message);
      }
    }
    return TMDB_GENRES;
  }

  // 6. Discover by Genres, Mood, Min Rating, Sort
  async discoverMovies({ genreIds = [], mood = null, minRating = 0, sortBy = "popularity.desc", page = 1 } = {}) {
    let effectiveGenres = [...genreIds];

    if (mood) {
      const moodGenres = getMoodGenres(mood);
      effectiveGenres = [...new Set([...effectiveGenres, ...moodGenres])];
    }

    if (this.isLive) {
      try {
        const params = {
          api_key: this.apiKey,
          page,
          sort_by: sortBy,
          "vote_average.gte": minRating > 0 ? minRating : undefined,
          "vote_count.gte": 100,
          include_adult: false
        };

        if (effectiveGenres.length > 0) {
          params.with_genres = effectiveGenres.join(",");
        }

        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params,
          headers: this.getHeaders()
        });

        return {
          results: (response.data.results || []).map(m => this.formatMovie(m)),
          page: response.data.page,
          total_pages: response.data.total_pages,
          source: "tmdb"
        };
      } catch (err) {
        console.warn("TMDB discover call failed, falling back to mock filtering:", err.message);
      }
    }

    // Mock filtering
    let filtered = [...MOCK_MOVIES];

    if (effectiveGenres.length > 0) {
      filtered = filtered.filter(m =>
        m.genre_ids && m.genre_ids.some(gid => effectiveGenres.includes(gid))
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter(m => m.vote_average >= minRating);
    }

    if (sortBy === "vote_average.desc") {
      filtered.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === "release_date.desc") {
      filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else {
      filtered.sort((a, b) => b.vote_count - a.vote_count);
    }

    return {
      results: filtered.map(m => this.formatMovie(m)),
      page: 1,
      total_pages: 1,
      source: "mock"
    };
  }

  // 7. Surprise Me: Picks a random high-rated movie
  async getSurpriseMovie({ mood = null, genreId = null } = {}) {
    const discoverRes = await this.discoverMovies({
      genreIds: genreId ? [Number(genreId)] : [],
      mood,
      minRating: 7.0,
      sortBy: "popularity.desc"
    });

    const pool = discoverRes.results && discoverRes.results.length > 0 ? discoverRes.results : MOCK_MOVIES.map(m => this.formatMovie(m));
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    // Fetch full details with trailer
    return this.getMovieDetails(chosen.id);
  }

  // 8. Recommendations by Movie ID (Because you watched X)
  async getRecommendations(movieId) {
    const details = await this.getMovieDetails(movieId);
    return {
      movie: details,
      recommendations: details.recommendations || []
    };
  }
}

export const tmdbService = new TmdbService();
