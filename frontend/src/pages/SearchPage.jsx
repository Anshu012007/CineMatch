import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Loader2, Film } from "lucide-react";
import { movieApi } from "../api/client";
import { MovieCard } from "../components/MovieCard";
import { SkeletonCard } from "../components/SkeletonCard";
import { TrailerModal } from "../components/TrailerModal";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [minRating, setMinRating] = useState(0);
  const [activeTrailer, setActiveTrailer] = useState(null);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    async function executeSearch() {
      if (!initialQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await movieApi.search(initialQuery.trim());
        let list = data.results || [];

        // Apply local rating filter
        if (minRating > 0) {
          list = list.filter((m) => m.vote_average >= minRating);
        }

        // Apply local sort
        if (sortBy === "rating") {
          list.sort((a, b) => b.vote_average - a.vote_average);
        } else if (sortBy === "release_date") {
          list.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
        }

        setResults(list);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }

    executeSearch();
  }, [initialQuery, sortBy, minRating]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
          Find Your Next <span className="text-brand-500">Favorite Film</span>
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, character, or director..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-dark-surface border border-dark-border text-base text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-2xl transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-md shadow-brand-600/30"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filters & Results Bar */}
      {initialQuery && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mb-8 border-y border-dark-border/60">
          <p className="text-sm text-slate-300">
            {loading ? (
              <span>Searching catalog...</span>
            ) : (
              <span>
                Found <strong className="text-brand-500">{results.length}</strong> results for "
                <strong className="text-white">{initialQuery}</strong>"
              </span>
            )}
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-card border border-dark-border rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="release_date">Newest Release</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-dark-card border border-dark-border rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="0">All Ratings</option>
              <option value="7">7.0+ Rating</option>
              <option value="8">8.0+ Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {results.map((movie) => (
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
      ) : initialQuery ? (
        <div className="py-20 text-center space-y-3">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No exact matches found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            We couldn't find any films matching "{initialQuery}". Try searching for another movie title, actor, or browse genres.
          </p>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 text-sm">
          Type in the box above to search the movie universe.
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
