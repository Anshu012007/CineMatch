import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import { SkeletonCard } from "./SkeletonCard";

export function MovieRow({ title, subtitle, movies = [], loading = false, onPlayTrailer }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (!loading && (!movies || movies.length === 0)) {
    return null;
  }

  return (
    <section className="relative py-4 px-4 sm:px-8 md:px-12 group/row">
      {/* Row Header */}
      <div className="flex items-end justify-between mb-3.5">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Row Carousel Area */}
      <div className="relative">
        {/* Left Scroll Trigger */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-brand-600 border border-white/10 text-white flex items-center justify-center shadow-xl opacity-0 group-hover/row:opacity-100 transition-all duration-200 focus:outline-none"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Horizontal Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth snap-x snap-mandatory"
        >
          {loading ? (
            Array.from({ length: 7 }).map((_, idx) => <SkeletonCard key={idx} />)
          ) : (
            movies.map((movie) => (
              <div key={movie.id || movie.movie_id} className="snap-start">
                <MovieCard movie={movie} onPlayTrailer={onPlayTrailer} />
              </div>
            ))
          )}
        </div>

        {/* Right Scroll Trigger */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-10 h-10 rounded-full bg-black/80 hover:bg-brand-600 border border-white/10 text-white flex items-center justify-center shadow-xl opacity-0 group-hover/row:opacity-100 transition-all duration-200 focus:outline-none"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
