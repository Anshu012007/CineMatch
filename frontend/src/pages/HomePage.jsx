import React, { useState, useEffect } from "react";
import { Hero } from "../components/Hero";
import { QuickFilters } from "../components/QuickFilters";
import { MovieRow } from "../components/MovieRow";
import { TrailerModal } from "../components/TrailerModal";
import { SurpriseModal } from "../components/SurpriseModal";
import { movieApi } from "../api/client";
import { useMovieLists } from "../context/MovieListsContext";

export function HomePage({ onOpenAI, onOpenAuth }) {
  const [spotlightMovie, setSpotlightMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [moodMovies, setMoodMovies] = useState([]);
  const [personalRecs, setPersonalRecs] = useState({ movie: null, recommendations: [] });
  const [activeMood, setActiveMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moodLoading, setMoodLoading] = useState(false);

  // Trailer modal state
  const [activeTrailer, setActiveTrailer] = useState(null);
  // Surprise modal state
  const [surpriseOpen, setSurpriseOpen] = useState(false);

  const { favorites, watched } = useMovieLists();

  // Initial load: trending, top rated, and personal recommendation
  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const [trendingData, topRatedData] = await Promise.all([
          movieApi.getTrending("week"),
          movieApi.getTopRated(1)
        ]);

        const trendingList = trendingData.results || [];
        setTrendingMovies(trendingList);
        setTopRatedMovies(topRatedData.results || []);

        // Pick top trending movie for hero banner
        if (trendingList.length > 0) {
          // Fetch full details of first trending movie so we have trailer & tagline
          try {
            const heroDetails = await movieApi.getMovieDetails(trendingList[0].id);
            setSpotlightMovie(heroDetails);
          } catch (e) {
            setSpotlightMovie(trendingList[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load home catalog:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  // Step 9: Recommendation Engine MVP
  // If user has watched or favorited movies, fetch recommendations for the latest one!
  useEffect(() => {
    const seedMovie = watched[0] || favorites[0];
    if (seedMovie) {
      const seedId = seedMovie.id || seedMovie.movie_id;
      movieApi
        .getRecommendations(seedId)
        .then((data) => {
          if (data && data.recommendations && data.recommendations.length > 0) {
            setPersonalRecs({
              movie: seedMovie,
              recommendations: data.recommendations
            });
          }
        })
        .catch((err) => console.error("Error loading recommendations:", err));
    }
  }, [watched, favorites]);

  // Load mood movies when user picks a mood
  const handleSelectMood = async (moodKey) => {
    setActiveMood(moodKey);
    if (!moodKey) {
      setMoodMovies([]);
      return;
    }

    setMoodLoading(true);
    try {
      const data = await movieApi.discover({ mood: moodKey, sortBy: "popularity.desc" });
      setMoodMovies(data.results || []);
    } catch (err) {
      console.error("Error loading mood movies:", err);
    } finally {
      setMoodLoading(false);
    }
  };

  const handlePlayTrailer = (movie) => {
    setActiveTrailer({
      key: movie.trailer_key,
      title: movie.title || movie.movie_title
    });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 pb-20">
      {/* Hero Section */}
      <Hero
        movie={spotlightMovie}
        loading={loading}
        onPlayTrailer={handlePlayTrailer}
      />

      {/* Quick Filters */}
      <QuickFilters
        activeMood={activeMood}
        onSelectMood={handleSelectMood}
        onSurpriseMe={() => setSurpriseOpen(true)}
      />

      {/* Active Mood Row (if selected) */}
      {activeMood && (
        <div className="pt-4 animate-fade-in">
          <MovieRow
            title={`Curated for "${activeMood.charAt(0).toUpperCase() + activeMood.slice(1)}" Mood`}
            subtitle="Hand-picked genres and themes matching how you want to feel right now"
            movies={moodMovies}
            loading={moodLoading}
            onPlayTrailer={handlePlayTrailer}
          />
        </div>
      )}

      {/* Personal Recommendations (Step 9 MVP) */}
      {personalRecs.movie && personalRecs.recommendations.length > 0 && (
        <div className="pt-2 animate-fade-in">
          <MovieRow
            title={`Because you watched ${personalRecs.movie.title || personalRecs.movie.movie_title}`}
            subtitle="Personalized recommendations based on your viewing history"
            movies={personalRecs.recommendations}
            onPlayTrailer={handlePlayTrailer}
          />
        </div>
      )}

      {/* Trending Now Row */}
      <div className="pt-2">
        <MovieRow
          title="Trending Now"
          subtitle="The most popular films being watched this week"
          movies={trendingMovies}
          loading={loading}
          onPlayTrailer={handlePlayTrailer}
        />
      </div>

      {/* Top Rated Masterpieces Row */}
      <div className="pt-2">
        <MovieRow
          title="Top Rated Masterpieces"
          subtitle="All-time cinema classics with the highest ratings"
          movies={topRatedMovies}
          loading={loading}
          onPlayTrailer={handlePlayTrailer}
        />
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={Boolean(activeTrailer)}
        trailerKey={activeTrailer?.key}
        title={activeTrailer?.title}
        onClose={() => setActiveTrailer(null)}
      />

      {/* Surprise Me Modal */}
      <SurpriseModal
        isOpen={surpriseOpen}
        onClose={() => setSurpriseOpen(false)}
        onPlayTrailer={handlePlayTrailer}
        initialMood={activeMood}
      />
    </div>
  );
}
