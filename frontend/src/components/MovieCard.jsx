import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Bookmark, Heart, CheckCircle, Play } from "lucide-react";
import { useMovieLists } from "../context/MovieListsContext";

export function MovieCard({ movie, onPlayTrailer }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    toggleWatchlist,
    toggleFavorite,
    toggleWatched,
    isInWatchlist,
    isInFavorites,
    isWatched
  } = useMovieLists();

  if (!movie) return null;

  const id = movie.id || movie.movie_id;
  const title = movie.title || movie.movie_title || "Untitled";
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "";
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : null;

  // Resolve poster URL
  let posterUrl = movie.poster_url;
  if (!posterUrl && movie.poster_path) {
    posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  }

  const inWatchlist = isInWatchlist(id);
  const inFavorites = isInFavorites(id);
  const watched = isWatched(id);

  return (
    <div className="group relative flex-none w-[170px] sm:w-[195px] md:w-[220px] rounded-xl overflow-hidden bg-dark-surface border border-dark-border/40 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1.5 flex flex-col select-none">
      {/* Poster Container */}
      <Link to={`/movie/${id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-dark-card block">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-dark-card animate-pulse" />
        )}

        {posterUrl && !imageError ? (
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-dark-card p-4 text-center text-slate-500">
            <span className="text-3xl mb-2">🎬</span>
            <span className="text-xs line-clamp-2">{title}</span>
          </div>
        )}

        {/* Rating Badge Top Left */}
        {rating && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>
        )}

        {/* Quick Action Overlay Top Right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(movie);
            }}
            title={inFavorites ? "Remove from Favorites" : "Add to Favorites"}
            className={`p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              inFavorites
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/50"
                : "bg-black/60 text-slate-300 hover:text-white hover:bg-black/80"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${inFavorites ? "fill-white" : ""}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatchlist(movie);
            }}
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            className={`p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              inWatchlist
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/50"
                : "bg-black/60 text-slate-300 hover:text-white hover:bg-black/80"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${inWatchlist ? "fill-white" : ""}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatched(movie);
            }}
            title={watched ? "Unmark as Watched" : "Mark as Watched"}
            className={`p-1.5 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              watched
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/50"
                : "bg-black/60 text-slate-300 hover:text-white hover:bg-black/80"
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${watched ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Quick Play Trailer Button in Center (Hover) */}
        {onPlayTrailer && movie.trailer_key && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPlayTrailer(movie);
              }}
              className="pointer-events-auto p-3 rounded-full bg-brand-600/90 text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
              title="Watch Trailer"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </button>
          </div>
        )}
      </Link>

      {/* Card Info Footer */}
      <Link to={`/movie/${id}`} className="p-3 flex flex-col justify-between flex-1">
        <h4 className="font-semibold text-sm text-slate-100 group-hover:text-brand-500 transition-colors line-clamp-1">
          {title}
        </h4>
        <div className="flex items-center justify-between mt-1 text-xs text-slate-400">
          <span>{releaseYear || "Movie"}</span>
          {movie.genres && movie.genres.length > 0 && (
            <span className="text-slate-500 truncate max-w-[90px] text-right">
              {movie.genres[0].name || movie.genres[0]}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
