import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Bot, Users, Film, Compass, User, LogOut, Menu, X, Bookmark } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { useMovieLists } from "../context/MovieListsContext";

export function Navbar({ onOpenAuth, onOpenSurprise, onOpenAI }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { watchlist, favorites } = useMovieLists();
  const location = useLocation();

  // Blur on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click or route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Explore & Genres", path: "/explore", icon: Compass },
    { label: "Group Match", path: "/group", icon: Users }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-dark-bg/90 backdrop-blur-xl border-b border-dark-border/60 py-3 shadow-xl shadow-black/40"
          : "bg-gradient-to-b from-dark-bg/90 via-dark-bg/50 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-white flex items-center">
            Cine<span className="text-brand-500">Match</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors hover:text-white ${
                location.pathname === link.path ? "text-brand-500 font-semibold" : "text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Bar in Desktop Navbar */}
        <div className="hidden lg:block w-72">
          <SearchBar placeholder="Search movies..." />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAI}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-card border border-brand-500/40 hover:border-brand-500 text-brand-400 hover:text-brand-300 text-xs font-semibold shadow-md shadow-brand-600/10 hover:scale-105 transition-all"
            title="Open AI Movie Curator"
          >
            <Bot className="w-3.5 h-3.5 text-brand-500" />
            <span>AI Curator</span>
          </button>

          {/* Surprise Me Button */}
          <button
            onClick={onOpenSurprise}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-dark-card border border-dark-border hover:border-amber-400/60 text-slate-300 hover:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Surprise Me"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Surprise</span>
          </button>

          {/* User Auth / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-dark-surface border border-dark-border hover:border-slate-400 transition-colors"
              >
                <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[100px] truncate">
                  {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </span>
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                  {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-dark-surface border border-dark-border/80 rounded-2xl shadow-2xl overflow-hidden py-1.5 backdrop-blur-xl animate-fade-in z-50">
                  <div className="px-4 py-2 border-b border-dark-border/40">
                    <p className="text-xs font-bold text-white truncate">
                      {user.user_metadata?.full_name || "Movie Lover"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-dark-card transition-colors"
                  >
                    <User className="w-4 h-4 text-brand-500" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/profile?tab=watchlist"
                    className="flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-200 hover:bg-dark-card transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bookmark className="w-4 h-4 text-brand-500" />
                      <span>Watchlist</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-dark-card text-slate-400">
                      {watchlist.length}
                    </span>
                  </Link>
                  <div className="border-t border-dark-border/40 my-1" />
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-dark-card transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-brand-600/30 transition-all active:scale-95"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-dark-card border border-dark-border"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-dark-border/60 bg-dark-surface/98 backdrop-blur-xl px-4 py-4 space-y-3 animate-slide-down">
          <div className="mb-2">
            <SearchBar placeholder="Search movies..." />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                location.pathname === link.path
                  ? "bg-brand-600/10 text-brand-500 font-semibold"
                  : "text-slate-300 hover:bg-dark-card"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAI();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-brand-400 hover:bg-dark-card text-left"
          >
            <Bot className="w-4 h-4 text-brand-500" />
            <span>AI Movie Assistant</span>
          </button>
        </div>
      )}
    </nav>
  );
}
