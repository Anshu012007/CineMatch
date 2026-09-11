import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Smile, CloudRain, Ghost, Laugh, Flame, Coffee, Sparkles, Filter, RotateCcw, Star } from "lucide-react";
import { movieApi } from "../api/client";
import { MovieCard } from "../components/MovieCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { TrailerModal } from "../components/TrailerModal";

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMood = searchParams.get("mood") || "";

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedMood, setSelectedMood] = useState(initialMood);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTrailer, setActiveTrailer] = useState(null);

  const moods = [
    { id: "happy", label: "Happy", icon: Smile, desc: "Uplifting & joyful" },
    { id: "excited", label: "Excited", icon: Flame, desc: "Action & grand thrills" },
    { id: "funny", label: "Funny", icon: Laugh, desc: "Pure comedy & laughs" },
    { id: "scared", label: "Scared", icon: Ghost, desc: "Horror & suspense" },
    { id: "sad", label: "Sad", icon: CloudRain, desc: "Emotional dramas" },
    { id: "relaxed", label: "Relaxed", icon: Coffee, desc: "Calm & aesthetic" }
  ];

  // Fetch genres on mount
  useEffect(() => {
    async function loadGenres() {
      try {
        const list = await movieApi.getGenres();
        setGenres(list);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    }
    loadGenres();
  }, []);

  // Fetch discovered movies whenever filters change
  useEffect(() => {
    async function fetchFilteredMovies() {
      setLoading(true);
      try {
        const data = await movieApi.discover({
          genres: selectedGenres,
          mood: selectedMood,
          minRating,
          sortBy
        });
        setMovies(data.results || []);
      } catch (err) {
        console.error("Discover movies error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredMovies();
  }, [selectedGenres, selectedMood, minRating, sortBy]);

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSelectMood = (moodId) => {
    const nextMood = selectedMood === moodId ? "" : moodId;
    setSelectedMood(nextMood);
    if (nextMood) {
      setSearchParams({ mood: nextMood });
    } else {
      setSearchParams({});
    }
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedMood("");
    setMinRating(0);
    setSortBy("popularity.desc");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <Filter className="w-8 h-8 text-brand-500" />
          <span>Explore by Mood & Genre</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Combine feelings, themes, and ratings to pinpoint your ideal movie match.
        </p>
      </div>

      {/* Mood Picker Section */}
      <div className="mb-8 p-6 rounded-3xl bg-dark-surface border border-dark-border/80 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Select Your Current Mood</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {moods.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMood(m.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-brand-600/20 border-brand-500 shadow-lg shadow-brand-600/20 scale-102"
                    : "bg-dark-card border-dark-border hover:border-slate-500"
                }`}
              >
                <div className={`p-2 rounded-xl w-fit ${isSelected ? "bg-brand-600 text-white" : "bg-dark-surface text-brand-400"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{m.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Genre Multi-Select Pills & Controls */}
      <div className="mb-10 space-y-5 p-6 rounded-3xl bg-dark-surface border border-dark-border/80 shadow-xl">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Filter by Genres (Multi-Select)
            </h3>
            {(selectedGenres.length > 0 || selectedMood || minRating > 0) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.map((g) => {
              const active = selectedGenres.includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    active
                      ? "bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/30 scale-105"
                      : "bg-dark-card border-dark-border text-slate-300 hover:text-white hover:border-slate-400"
                  }`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort & Minimum Rating Row */}
        <div className="pt-4 border-t border-dark-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Min Rating: {minRating > 0 ? `${minRating}+` : "Any"}</span>
            </label>
            <input
              type="range"
              min="0"
              max="8.5"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-32 accent-brand-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-400">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-card border border-dark-border rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="release_date.desc">Newest Release</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">
          Matching Films ({movies.length})
        </h2>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="flex justify-center">
              <MovieCard
                movie={movie}
                onPlayTrailer={(m) =>
                  setActiveTrailer({ key: m.trailer_key, title: m.title })
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 bg-dark-surface/50 rounded-3xl border border-dark-border">
          <p className="text-lg font-bold text-white">No movies match these exact criteria</p>
          <p className="text-xs text-slate-400">Try removing a genre filter or lowering the minimum rating slider.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={Boolean(activeTrailer)}
        trailerKey={activeTrailer?.key}
        title={activeTrailer?.title}
        onClose={() => setActiveTrailer(null)}
      />
    </div>
  );
}
