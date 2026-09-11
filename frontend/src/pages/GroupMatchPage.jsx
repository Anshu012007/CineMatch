import React, { useState, useEffect } from "react";
import { Users, Plus, Trash2, Sparkles, Check, X, Star, ShieldAlert } from "lucide-react";
import { movieApi } from "../api/client";
import { MovieCard } from "../components/MovieCard";
import { TrailerModal } from "../components/TrailerModal";

export function GroupMatchPage() {
  const [genres, setGenres] = useState([]);
  const [members, setMembers] = useState([
    { id: 1, name: "Person 1", genres: [28, 878], mood: "excited", dealbreakers: [27] },
    { id: 2, name: "Person 2", genres: [35, 12], mood: "happy", dealbreakers: [] }
  ]);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [activeTrailer, setActiveTrailer] = useState(null);

  const moods = [
    { id: "happy", label: "Happy" },
    { id: "excited", label: "Excited" },
    { id: "funny", label: "Funny" },
    { id: "scared", label: "Scared" },
    { id: "sad", label: "Sad" },
    { id: "relaxed", label: "Relaxed" }
  ];

  useEffect(() => {
    movieApi.getGenres().then(setGenres).catch(console.error);
  }, []);

  const addMember = () => {
    if (members.length >= 6) return;
    const newId = Date.now();
    setMembers([
      ...members,
      {
        id: newId,
        name: `Person ${members.length + 1}`,
        genres: [28],
        mood: "happy",
        dealbreakers: []
      }
    ]);
  };

  const removeMember = (id) => {
    if (members.length <= 2) return;
    setMembers(members.filter((m) => m.id !== id));
  };

  const updateMember = (id, field, value) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const toggleMemberGenre = (memberId, genreId) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    const next = member.genres.includes(genreId)
      ? member.genres.filter((g) => g !== genreId)
      : [...member.genres, genreId];
    updateMember(memberId, "genres", next);
  };

  const toggleDealbreaker = (memberId, genreId) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    const next = member.dealbreakers.includes(genreId)
      ? member.dealbreakers.filter((g) => g !== genreId)
      : [...member.dealbreakers, genreId];
    updateMember(memberId, "dealbreakers", next);
  };

  const handleFindMatches = async () => {
    setLoading(true);
    try {
      const data = await movieApi.groupMatch(members);
      setMatches(data.matches || []);
    } catch (err) {
      console.error("Group matching error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-600/20 text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Users className="w-4 h-4" />
          <span>CineMatch Together</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Group Movie Consensus
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Watching with friends or family? Input everyone's taste and dealbreakers to find movies that satisfy the entire room.
        </p>
      </div>

      {/* Members Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {members.map((member, idx) => (
          <div
            key={member.id}
            className="p-5 rounded-3xl bg-dark-surface border border-dark-border/80 shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Card Title & Remove Button */}
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(member.id, "name", e.target.value)}
                  className="bg-transparent border-b border-dark-border focus:border-brand-500 font-bold text-base text-white focus:outline-none pb-1"
                />
                {members.length > 2 && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove Person"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mood Selector */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Vibe / Mood
                </label>
                <select
                  value={member.mood}
                  onChange={(e) => updateMember(member.id, "mood", e.target.value)}
                  className="w-full bg-dark-card border border-dark-border rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500"
                >
                  {moods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loved Genres (Multi-select) */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Must-Have / Preferred Genres
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {genres.slice(0, 12).map((g) => {
                    const selected = member.genres.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleMemberGenre(member.id, g.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                          selected
                            ? "bg-brand-600 border-brand-500 text-white"
                            : "bg-dark-card border-dark-border text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dealbreaker Genres */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-400 mb-1.5 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Strict Dealbreakers (Veto)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {genres.slice(0, 10).map((g) => {
                    const isDealbreaker = member.dealbreakers.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleDealbreaker(member.id, g.id)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border transition-all ${
                          isDealbreaker
                            ? "bg-rose-950/80 border-rose-500 text-rose-300"
                            : "bg-dark-card/50 border-dark-border/40 text-slate-500 hover:text-slate-400"
                        }`}
                      >
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member & Match Button Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        {members.length < 6 && (
          <button
            onClick={addMember}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-dark-card border border-dark-border hover:border-slate-400 text-slate-200 font-semibold text-sm transition-all"
          >
            <Plus className="w-4 h-4 text-brand-500" />
            <span>Add Another Person ({members.length}/6)</span>
          </button>
        )}

        <button
          onClick={handleFindMatches}
          disabled={loading}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? "Crunching Preferences..." : "Find Best Group Matches"}</span>
        </button>
      </div>

      {/* Match Results */}
      {matches.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="border-t border-dark-border/60 pt-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">Consensus Recommendations</h2>
            <span className="text-xs text-slate-400 font-medium">
              Ranked by combined group compatibility
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((movie) => (
              <div
                key={movie.id}
                className="p-5 rounded-3xl bg-dark-surface border border-dark-border flex flex-col sm:flex-row gap-5 items-start hover:border-brand-500/50 transition-all shadow-xl"
              >
                <div className="w-32 aspect-[2/3] rounded-xl overflow-hidden bg-dark-card shrink-0 mx-auto sm:mx-0">
                  <img
                    src={movie.poster_url || `https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                      {movie.compatibilityScore}% Compatibility
                    </span>
                    <span className="text-xs text-slate-400">{movie.release_date?.split("-")[0]}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">{movie.title}</h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">{movie.overview}</p>

                  <div className="mt-3 p-2.5 rounded-xl bg-dark-card/80 border border-dark-border text-xs text-slate-300">
                    <span className="text-brand-400 font-semibold">Group Consensus: </span>
                    {movie.matchReason}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <a
                      href={`/movie/${movie.id}`}
                      className="text-xs font-semibold text-brand-500 hover:text-brand-400"
                    >
                      View Movie Details →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
