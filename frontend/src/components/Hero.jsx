import React from "react";
import { Link } from "react-router-dom";
import { Play, Info, Star, Bookmark, Heart, Sparkles } from "lucide-react";
import { useMovieLists } from "../context/MovieListsContext";
import { SearchBar } from "./SearchBar";
import { SkeletonHero } from "./SkeletonCard";

export function Hero({ movie, loading = false, onPlayTrailer }) {
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isInFavorites } = useMovieLists();

  if (loading) {
    return <SkeletonHero />;
  }

  if (!movie) {
    return null;
  }

  const id = movie.id || movie.movie_id;
  const inWatchlist = isInWatchlist(id);
  const inFavorites = isInFavorites(id);

  const backdropUrl =
    movie.backdrop_url ||
    (movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null);

  return (
    <div className="relative w-full min-h-[75vh] sm:min-h-[85vh] flex items-end pb-12 sm:pb-20 overflow-hidden select-none">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center transform scale-105 animate-fade-in"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-dark-bg via-dark-surface to-dark-card" />
        )}
        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 hero-side-gradient" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl space-y-4">
          {/* Spotlight Tag */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-600/30">
              <Sparkles className="w-3.5 h-3.5" />
              Spotlight
            </span>

            {movie.vote_average > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {Number(movie.vote_average).toFixed(1)} Rating
              </span>
            )}

            <span className="text-xs text-slate-300 font-medium">
              {movie.release_date?.split("-")[0]}
            </span>

            {movie.genres && movie.genres.length > 0 && (
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                • {movie.genres.slice(0, 3).map((g) => g.name || g).join(", ")}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
            {movie.title}
          </h1>

          {/* Tagline or Overview */}
          {movie.tagline && (
            <p className="text-sm sm:text-base font-medium text-brand-400 italic drop-shadow">
              "{movie.tagline}"
            </p>
          )}

          <p className="text-xs sm:text-sm text-slate-200/90 line-clamp-3 leading-relaxed max-w-xl drop-shadow">
            {movie.overview}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {movie.trailer_key && (
              <button
                onClick={() => onPlayTrailer(movie)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Watch Trailer</span>
              </button>
            )}

            <Link
              to={`/movie/${id}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-dark-card/80 hover:bg-dark-card border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              <Info className="w-4 h-4" />
              <span>More Info</span>
            </Link>

            <button
              onClick={() => toggleWatchlist(movie)}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all active:scale-90 ${
                inWatchlist
                  ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/30"
                  : "bg-black/60 border-white/20 text-slate-200 hover:text-white hover:border-white/40"
              }`}
              title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Bookmark className={`w-4 h-4 ${inWatchlist ? "fill-white" : ""}`} />
            </button>

            <button
              onClick={() => toggleFavorite(movie)}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all active:scale-90 ${
                inFavorites
                  ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30"
                  : "bg-black/60 border-white/20 text-slate-200 hover:text-rose-400 hover:border-white/40"
              }`}
              title={inFavorites ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-4 h-4 ${inFavorites ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Integrated Hero Search for Mobile / Convenience */}
          <div className="pt-4 max-w-lg lg:hidden">
            <SearchBar placeholder="Quick movie search..." />
          </div>
        </div>
      </div>
    </div>
  );
}
