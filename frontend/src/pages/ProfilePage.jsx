import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Bookmark, Heart, CheckCircle, User, LogOut, Film, Trash2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMovieLists } from "../context/MovieListsContext";
import { MovieCard } from "../components/MovieCard";

export function ProfilePage({ onOpenAuth }) {
  const { user, signOut } = useAuth();
  const { watchlist, favorites, watched, toggleWatchlist, toggleFavorite, toggleWatched } = useMovieLists();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "watchlist";

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-500 mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign In to View Your Profile</h2>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          Keep track of movies you want to watch, record your favorites, and build your watched history.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/30"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  // Choose list according to tab
  const currentList =
    activeTab === "favorites" ? favorites : activeTab === "watched" ? watched : watchlist;

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-dark-surface border border-dark-border/80 shadow-2xl mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl shadow-brand-600/30 shrink-0">
            {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {user.user_metadata?.full_name || "Movie Enthusiast"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-4 mt-3 text-xs font-semibold">
              <span className="text-slate-300">
                <strong className="text-brand-500">{watchlist.length}</strong> in Watchlist
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                <strong className="text-rose-400">{favorites.length}</strong> Favorites
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                <strong className="text-emerald-400">{watched.length}</strong> Watched
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-card border border-dark-border hover:border-rose-500 text-rose-400 text-xs font-semibold transition-all self-end sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-dark-border/60 pb-4 mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setTab("watchlist")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "watchlist"
              ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
              : "bg-dark-surface border border-dark-border text-slate-300 hover:text-white"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Watchlist ({watchlist.length})</span>
        </button>

        <button
          onClick={() => setTab("favorites")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "favorites"
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
              : "bg-dark-surface border border-dark-border text-slate-300 hover:text-white"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorites ({favorites.length})</span>
        </button>

        <button
          onClick={() => setTab("watched")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === "watched"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
              : "bg-dark-surface border border-dark-border text-slate-300 hover:text-white"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Watched History ({watched.length})</span>
        </button>
      </div>

      {/* Tab Content List */}
      {currentList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {currentList.map((movie) => (
            <div key={movie.id || movie.movie_id} className="flex justify-center">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 rounded-3xl bg-dark-surface/40 border border-dark-border">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your {activeTab} is currently empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Discover movies on the homepage and click the bookmark, heart, or checkmark icons to save them here!
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-colors shadow-lg shadow-brand-600/30"
          >
            <span>Explore Movies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
