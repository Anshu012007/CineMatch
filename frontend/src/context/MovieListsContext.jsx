import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const MovieListsContext = createContext(null);

export function MovieListsProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load lists on mount or when user changes
  useEffect(() => {
    async function loadLists() {
      setLoading(true);

      if (user && isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from("user_movies")
            .select("*")
            .eq("user_id", user.id);

          if (error) {
            console.error("Error loading user movies from Supabase:", error);
          } else if (data) {
            setWatchlist(data.filter((m) => m.list_type === "watchlist"));
            setFavorites(data.filter((m) => m.list_type === "favorites"));
            setWatched(data.filter((m) => m.list_type === "watched"));
          }
        } catch (err) {
          console.error("Failed to query Supabase:", err);
        }
      } else {
        // LocalStorage fallback for guests or demo users
        try {
          const wl = JSON.parse(localStorage.getItem("cinematch_watchlist") || "[]");
          const fav = JSON.parse(localStorage.getItem("cinematch_favorites") || "[]");
          const wtd = JSON.parse(localStorage.getItem("cinematch_watched") || "[]");

          setWatchlist(wl);
          setFavorites(fav);
          setWatched(wtd);
        } catch (e) {
          console.error("Failed to read localStorage lists:", e);
        }
      }

      setLoading(false);
    }

    loadLists();
  }, [user]);

  // Sync to localStorage when in demo/guest mode
  const saveToLocal = (type, list) => {
    localStorage.setItem(`cinematch_${type}`, JSON.stringify(list));
  };

  // Helper to normalize movie object for storage
  const normalizeMovie = (m) => ({
    movie_id: m.id || m.movie_id,
    movie_title: m.title || m.movie_title || "Untitled",
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    release_date: m.release_date,
    vote_average: m.vote_average,
    genres: m.genres || []
  });

  // Toggle Watchlist
  const toggleWatchlist = async (movie) => {
    const movieId = movie.id || movie.movie_id;
    const exists = watchlist.some((m) => (m.id || m.movie_id) === movieId);

    if (exists) {
      const updated = watchlist.filter((m) => (m.id || m.movie_id) !== movieId);
      setWatchlist(updated);
      saveToLocal("watchlist", updated);
      showToast(`Removed "${movie.title || movie.movie_title}" from Watchlist`, "info");

      if (user && isSupabaseConfigured) {
        await supabase
          .from("user_movies")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movieId)
          .eq("list_type", "watchlist");
      }
    } else {
      const item = { ...normalizeMovie(movie), list_type: "watchlist" };
      const updated = [item, ...watchlist];
      setWatchlist(updated);
      saveToLocal("watchlist", updated);
      showToast(`Added "${movie.title || movie.movie_title}" to Watchlist`, "success");

      if (user && isSupabaseConfigured) {
        await supabase.from("user_movies").insert({
          user_id: user.id,
          ...item
        });
      }
    }
  };

  // Toggle Favorite
  const toggleFavorite = async (movie) => {
    const movieId = movie.id || movie.movie_id;
    const exists = favorites.some((m) => (m.id || m.movie_id) === movieId);

    if (exists) {
      const updated = favorites.filter((m) => (m.id || m.movie_id) !== movieId);
      setFavorites(updated);
      saveToLocal("favorites", updated);
      showToast(`Removed from Favorites`, "info");

      if (user && isSupabaseConfigured) {
        await supabase
          .from("user_movies")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movieId)
          .eq("list_type", "favorites");
      }
    } else {
      const item = { ...normalizeMovie(movie), list_type: "favorites" };
      const updated = [item, ...favorites];
      setFavorites(updated);
      saveToLocal("favorites", updated);
      showToast(`Added to Favorites! ♥`, "success");

      if (user && isSupabaseConfigured) {
        await supabase.from("user_movies").insert({
          user_id: user.id,
          ...item
        });
      }
    }
  };

  // Toggle Watched
  const toggleWatched = async (movie) => {
    const movieId = movie.id || movie.movie_id;
    const exists = watched.some((m) => (m.id || m.movie_id) === movieId);

    if (exists) {
      const updated = watched.filter((m) => (m.id || m.movie_id) !== movieId);
      setWatched(updated);
      saveToLocal("watched", updated);
      showToast(`Unmarked as watched`, "info");

      if (user && isSupabaseConfigured) {
        await supabase
          .from("user_movies")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movieId)
          .eq("list_type", "watched");
      }
    } else {
      const item = { ...normalizeMovie(movie), list_type: "watched" };
      const updated = [item, ...watched];
      setWatched(updated);
      saveToLocal("watched", updated);
      showToast(`Marked as Watched! ✓`, "success");

      if (user && isSupabaseConfigured) {
        await supabase.from("user_movies").insert({
          user_id: user.id,
          ...item
        });
      }
    }
  };

  const isInWatchlist = (id) => watchlist.some((m) => (m.id || m.movie_id) === Number(id));
  const isInFavorites = (id) => favorites.some((m) => (m.id || m.movie_id) === Number(id));
  const isWatched = (id) => watched.some((m) => (m.id || m.movie_id) === Number(id));

  return (
    <MovieListsContext.Provider
      value={{
        watchlist,
        favorites,
        watched,
        loading,
        toggleWatchlist,
        toggleFavorite,
        toggleWatched,
        isInWatchlist,
        isInFavorites,
        isWatched
      }}
    >
      {children}
    </MovieListsContext.Provider>
  );
}

export function useMovieLists() {
  const context = useContext(MovieListsContext);
  if (!context) {
    throw new Error("useMovieLists must be used within a MovieListsProvider");
  }
  return context;
}
