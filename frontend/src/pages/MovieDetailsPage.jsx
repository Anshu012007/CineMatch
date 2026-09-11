import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Calendar, Bookmark, Heart, CheckCircle, Play, Share2, ArrowLeft, Users } from "lucide-react";
import { movieApi } from "../api/client";
import { useMovieLists } from "../context/MovieListsContext";
import { useToast } from "../context/ToastContext";
import { TrailerModal } from "../components/TrailerModal";
import { MovieRow } from "../components/MovieRow";

export function MovieDetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const {
    toggleWatchlist,
    toggleFavorite,
    toggleWatched,
    isInWatchlist,
    isInFavorites,
    isWatched
  } = useMovieLists();
  const { showToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadDetails() {
      setLoading(true);
      setError(null);
      try {
        const data = await movieApi.getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        console.error("Error loading movie details:", err);
        setError("Failed to load movie details. Please check the ID or try again.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadDetails();
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Movie link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-400">Loading film details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md">{error || "We couldn't retrieve information for this title."}</p>
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isInFavorites(movie.id);
  const watched = isWatched(movie.id);

  const backdropUrl =
    movie.backdrop_url ||
    (movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null);
  const posterUrl =
    movie.poster_url ||
    (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null);

  const formatRuntime = (mins) => {
    if (!mins) return null;
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return `${hours}h ${remainder}m`;
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 pb-20">
      {/* Backdrop Banner */}
      <div className="relative w-full h-[60vh] min-h-[420px] max-h-[600px] overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-top opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/60 to-transparent" />

        {/* Back Link */}
        <Link
          to="/"
          className="absolute top-24 left-4 sm:left-8 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-black/80 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Main Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Column */}
          <div className="w-56 sm:w-64 md:w-72 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-dark-card border border-dark-border/80 shrink-0 mx-auto md:mx-0">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                No Poster Available
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4 text-left">
            {/* Metadata Badges */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {Number(movie.vote_average).toFixed(1)} / 10
                  {movie.vote_count > 0 && (
                    <span className="text-xs text-amber-400/70 font-normal">
                      ({movie.vote_count.toLocaleString()} votes)
                    </span>
                  )}
                </span>
              )}

              {movie.release_date && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-card border border-dark-border text-xs text-slate-300 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {movie.release_date}
                </span>
              )}

              {movie.runtime && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-card border border-dark-border text-xs text-slate-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}

              {movie.director && (
                <span className="px-3 py-1 rounded-lg bg-dark-card border border-dark-border text-xs text-slate-300 font-medium">
                  Directed by: <strong className="text-white">{movie.director}</strong>
                </span>
              )}
            </div>

            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base text-brand-400 font-medium italic">
                "{movie.tagline}"
              </p>
            )}

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {movie.genres.map((g) => (
                  <span
                    key={g.id || g}
                    className="px-3 py-1 rounded-full bg-dark-card/90 border border-dark-border text-xs font-semibold text-slate-200"
                  >
                    {g.name || g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div className="pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Overview
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {movie.overview}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-dark-border/60">
              {movie.trailer_key && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-xl shadow-brand-600/30 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <button
                onClick={() => toggleWatchlist(movie)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  inWatchlist
                    ? "bg-brand-600/20 border-brand-500 text-brand-400"
                    : "bg-dark-card border-dark-border hover:border-slate-400 text-slate-200"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${inWatchlist ? "fill-brand-400" : ""}`} />
                <span>{inWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
              </button>

              <button
                onClick={() => toggleFavorite(movie)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  inFavorites
                    ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30"
                    : "bg-dark-card border-dark-border hover:border-rose-400 text-slate-200"
                }`}
              >
                <Heart className={`w-4 h-4 ${inFavorites ? "fill-white" : ""}`} />
                <span>{inFavorites ? "Favorited" : "Favorite"}</span>
              </button>

              <button
                onClick={() => toggleWatched(movie)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  watched
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-dark-card border-dark-border hover:border-emerald-400 text-slate-200"
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${watched ? "fill-white" : ""}`} />
                <span>{watched ? "Watched" : "Mark Watched"}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-dark-card border border-dark-border hover:border-slate-400 text-slate-300 hover:text-white transition-colors"
                title="Share Movie Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-500" />
              <span>Top Billed Cast</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.cast.map((actor) => (
                <div
                  key={actor.id || actor.name}
                  className="bg-dark-surface border border-dark-border/60 rounded-xl overflow-hidden shadow-lg p-3 text-center"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2.5 bg-dark-card border border-dark-border/80">
                    {actor.profile_url ? (
                      <img src={actor.profile_url} alt={actor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        Actor
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-xs sm:text-sm text-white truncate">{actor.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar / Recommended Movies */}
        {movie.recommendations && movie.recommendations.length > 0 && (
          <div className="mt-16 -mx-4 sm:-mx-6 lg:-mx-8">
            <MovieRow
              title="Similar Movies You Might Enjoy"
              subtitle="Films sharing similar themes, tone, and genre composition"
              movies={movie.recommendations}
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        trailerKey={movie.trailer_key}
        title={movie.title}
        onClose={() => setTrailerOpen(false)}
      />
    </div>
  );
}
