import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sparkles, RefreshCw, Play, Star, Bookmark, Heart, ArrowRight } from "lucide-react";
import { movieApi } from "../api/client";
import { useMovieLists } from "../context/MovieListsContext";

export function SurpriseModal({ isOpen, onClose, onPlayTrailer, initialMood = null }) {
  const [movie, setMovie] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const navigate = useNavigate();
  const { toggleWatchlist, toggleFavorite, isInWatchlist, isInFavorites } = useMovieLists();

  const fetchSurprise = async () => {
    setSpinning(true);
    try {
      // Simulate suspenseful roulette roll
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 600));
      const [data] = await Promise.all([
        movieApi.getSurprise({ mood: initialMood }),
        delayPromise
      ]);
      setMovie(data);
    } catch (err) {
      console.error("Error fetching surprise movie:", err);
    } finally {
      setSpinning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSurprise();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const inWatchlist = movie ? isInWatchlist(movie.id) : false;
  const inFavorites = movie ? isInFavorites(movie.id) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-dark-surface border border-dark-border rounded-3xl overflow-hidden shadow-2xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border/60 bg-dark-card/50">
          <div className="flex items-center gap-2 text-brand-500">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm uppercase tracking-wider text-slate-200">
              CineMatch Roulette
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-border/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roulette Content */}
        <div className="p-6 md:p-8">
          {spinning ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="text-lg font-semibold text-slate-100">Rolling the projector...</p>
              <p className="text-xs text-slate-400">Finding a critically acclaimed movie you'll love</p>
            </div>
          ) : movie ? (
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Poster */}
              <div className="w-40 sm:w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-dark-card shrink-0 border border-dark-border/80 mx-auto md:mx-0">
                <img
                  src={movie.poster_url || `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {movie.vote_average > 0 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {Number(movie.vote_average).toFixed(1)}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {movie.release_date?.split("-")[0]}
                  </span>
                  {movie.runtime && (
                    <span className="text-xs text-slate-400">
                      • {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {movie.title}
                </h2>

                {movie.tagline && (
                  <p className="text-xs italic text-brand-500 mt-1">{movie.tagline}</p>
                )}

                <p className="text-xs sm:text-sm text-slate-300 mt-3 line-clamp-3 sm:line-clamp-4 leading-relaxed">
                  {movie.overview}
                </p>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {(movie.genres || []).slice(0, 3).map((g) => (
                    <span
                      key={g.id || g}
                      className="px-2.5 py-0.5 rounded-full bg-dark-card border border-dark-border text-[11px] font-medium text-slate-300"
                    >
                      {g.name || g}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-4 border-t border-dark-border/60">
                  {movie.trailer_key && (
                    <button
                      onClick={() => onPlayTrailer(movie)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-brand-600/30"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Watch Trailer</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleWatchlist(movie)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      inWatchlist
                        ? "bg-brand-600/20 border-brand-500 text-brand-400"
                        : "bg-dark-card border-dark-border hover:border-slate-400 text-slate-200"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${inWatchlist ? "fill-brand-400" : ""}`} />
                    <span>{inWatchlist ? "Saved" : "Watchlist"}</span>
                  </button>

                  <button
                    onClick={() => toggleFavorite(movie)}
                    className={`p-2 rounded-xl border transition-all ${
                      inFavorites
                        ? "bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-600/30"
                        : "bg-dark-card border-dark-border hover:border-rose-400 text-slate-300 hover:text-rose-400"
                    }`}
                    title="Favorite"
                  >
                    <Heart className={`w-4 h-4 ${inFavorites ? "fill-white" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-dark-card/60 border-t border-dark-border/60">
          <button
            onClick={fetchSurprise}
            disabled={spinning}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-brand-500 ${spinning ? "animate-spin" : ""}`} />
            <span>Spin Again</span>
          </button>

          {movie && (
            <button
              onClick={() => {
                onClose();
                navigate(`/movie/${movie.id}`);
              }}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-500 hover:text-brand-400 transition-colors"
            >
              <span>View Full Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
