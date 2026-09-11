import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, Star, Film } from "lucide-react";
import { movieApi } from "../api/client";

export function SearchBar({ placeholder = "Search movies, genres, actors...", className = "" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const data = await movieApi.search(query.trim());
        setResults((data.results || []).slice(0, 6));
      } catch (err) {
        console.error("Live search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectMovie = (id) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/movie/${id}`);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-full bg-dark-surface/90 border border-dark-border text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
        />
        {loading ? (
          <Loader2 className="absolute right-3.5 w-4 h-4 text-slate-400 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3.5 p-0.5 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </form>

      {/* Live Search Dropdown Preview */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-surface/95 border border-dark-border/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
          {loading && results.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
              <span>Searching movie catalog...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-dark-border/40">
              <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-dark-card/40">
                Top Matches
              </div>
              {results.map((movie) => {
                const poster = movie.poster_url || (movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : null);
                const year = movie.release_date ? movie.release_date.split("-")[0] : "";

                return (
                  <button
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie.id)}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-dark-card text-left transition-colors group"
                  >
                    <div className="w-10 h-14 bg-dark-card rounded-md overflow-hidden shrink-0 border border-dark-border/60">
                      {poster ? (
                        <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <Film className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-100 group-hover:text-brand-500 truncate">
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span>{year || "Movie"}</span>
                        {movie.vote_average > 0 && (
                          <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {Number(movie.vote_average).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {/* Full Results Link */}
              <button
                onClick={handleSubmit}
                className="w-full py-2.5 px-4 bg-dark-card/70 hover:bg-brand-600/20 text-center text-xs font-semibold text-brand-500 hover:text-brand-400 transition-colors"
              >
                View all results for "{query}" →
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              No movies found matching "<span className="text-slate-200">{query}</span>"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
