import React from "react";
import { Sparkles, Trophy, Smile, CloudRain, Ghost, Laugh, Flame, Coffee, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickFilters({ onSelectMood, onSurpriseMe, activeMood }) {
  const moods = [
    { id: "happy", label: "Happy", icon: Smile, color: "hover:border-amber-400 hover:text-amber-300" },
    { id: "excited", label: "Excited", icon: Flame, color: "hover:border-rose-400 hover:text-rose-300" },
    { id: "funny", label: "Funny", icon: Laugh, color: "hover:border-orange-400 hover:text-orange-300" },
    { id: "scared", label: "Scared", icon: Ghost, color: "hover:border-purple-400 hover:text-purple-300" },
    { id: "sad", label: "Sad", icon: CloudRain, color: "hover:border-blue-400 hover:text-blue-300" },
    { id: "relaxed", label: "Relaxed", icon: Coffee, color: "hover:border-emerald-400 hover:text-emerald-300" }
  ];

  return (
    <div className="py-4 px-4 sm:px-8 md:px-12 border-b border-dark-border/40 bg-dark-bg/60 backdrop-blur-md sticky top-16 z-30">
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
        {/* Surprise Me Button */}
        <button
          onClick={onSurpriseMe}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-amber-500 text-white font-semibold text-xs sm:text-sm shrink-0 shadow-lg shadow-brand-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>Surprise Me</span>
        </button>

        {/* Explore / Genre Link */}
        <Link
          to="/explore"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-dark-card border border-dark-border hover:border-slate-400 text-slate-300 hover:text-white text-xs sm:text-sm font-medium shrink-0 transition-colors"
        >
          <Compass className="w-4 h-4 text-brand-500" />
          <span>All Genres</span>
        </Link>

        {/* Mood Pills */}
        <div className="h-5 w-[1px] bg-dark-border mx-1 shrink-0" />
        
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isActive = activeMood === mood.id;

          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(isActive ? null : mood.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium shrink-0 border transition-all ${
                isActive
                  ? "bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/30"
                  : `bg-dark-surface/80 border-dark-border text-slate-300 ${mood.color}`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
