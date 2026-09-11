import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { MovieListsProvider } from "./context/MovieListsContext";
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { SurpriseModal } from "./components/SurpriseModal";
import { AIAssistantModal } from "./components/AIAssistantModal";
import { TrailerModal } from "./components/TrailerModal";

import { HomePage } from "./pages/HomePage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";
import { SearchPage } from "./pages/SearchPage";
import { ExplorePage } from "./pages/ExplorePage";
import { ProfilePage } from "./pages/ProfilePage";
import { GroupMatchPage } from "./pages/GroupMatchPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [surpriseModalOpen, setSurpriseModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeTrailer, setActiveTrailer] = useState(null);

  const handlePlayTrailer = (movie) => {
    setActiveTrailer({
      key: movie.trailer_key,
      title: movie.title || movie.movie_title
    });
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <MovieListsProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-dark-bg text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
              {/* Sticky Top Navbar */}
              <Navbar
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenSurprise={() => setSurpriseModalOpen(true)}
                onOpenAI={() => setAiModalOpen(true)}
              />

              {/* Main Routing View */}
              <main className="flex-1">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage
                        onOpenAI={() => setAiModalOpen(true)}
                        onOpenAuth={() => setAuthModalOpen(true)}
                      />
                    }
                  />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route
                    path="/profile"
                    element={<ProfilePage onOpenAuth={() => setAuthModalOpen(true)} />}
                  />
                  <Route path="/group" element={<GroupMatchPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              {/* Global Floating Modals */}
              <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
              />

              <SurpriseModal
                isOpen={surpriseModalOpen}
                onClose={() => setSurpriseModalOpen(false)}
                onPlayTrailer={handlePlayTrailer}
              />

              <AIAssistantModal
                isOpen={aiModalOpen}
                onClose={() => setAiModalOpen(false)}
                onPlayTrailer={handlePlayTrailer}
              />

              <TrailerModal
                isOpen={Boolean(activeTrailer)}
                trailerKey={activeTrailer?.key}
                title={activeTrailer?.title}
                onClose={() => setActiveTrailer(null)}
              />

              {/* Footer */}
              <footer className="border-t border-dark-border/60 bg-dark-surface/80 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black tracking-tight text-white">
                      Cine<span className="text-brand-500">Match</span>
                    </span>
                    <span>— Personalized Movie Intelligence</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <Link to="/explore" className="hover:text-white transition-colors">Explore Genres</Link>
                    <Link to="/group" className="hover:text-white transition-colors">Group Match</Link>
                    <button onClick={() => setAiModalOpen(true)} className="hover:text-brand-400 transition-colors">AI Assistant</button>
                    <button onClick={() => setSurpriseModalOpen(true)} className="hover:text-amber-400 transition-colors">Surprise Me</button>
                  </div>

                  <div className="text-center md:text-right text-[11px] text-slate-400 space-y-1">
                    <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
                    <p>&copy; {new Date().getFullYear()} CineMatch. Built for cinephiles everywhere.</p>
                  </div>
                </div>
              </footer>
            </div>
          </Router>
        </MovieListsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
