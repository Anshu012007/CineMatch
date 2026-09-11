import React from "react";
import { Link } from "react-router-dom";
import { Film, Home, Search } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-500 mx-auto animate-pulse">
            <Film className="w-12 h-12" />
          </div>
          <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-brand-600 text-white font-extrabold text-xs shadow-lg shadow-brand-600/50">
            404
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Lost in the Multiverse?</h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            The page or movie reel you're looking for was either moved, deleted, or ended up on the cutting room floor.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all shadow-lg shadow-brand-600/30"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-dark-surface border border-dark-border hover:border-slate-400 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Explore Movies</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
