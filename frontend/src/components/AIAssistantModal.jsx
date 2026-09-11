import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Bot, Send, Sparkles, Star, Loader2, Play } from "lucide-react";
import { movieApi } from "../api/client";

export function AIAssistantModal({ isOpen, onClose, onPlayTrailer }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm CineMatch AI, your personal film curator. Tell me what kind of movie you're craving! For example:",
      suggestions: [
        "Suggest a movie like Interstellar but less complicated",
        "I want a scary movie under 2 hours",
        "Heartwarming comedy for family movie night",
        "A mind-bending 90s psychological thriller"
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (userPrompt) => {
    const promptToSend = (userPrompt || input).trim();
    if (!promptToSend || loading) return;

    // Add user message
    const newMessages = [...messages, { role: "user", text: promptToSend }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await movieApi.aiChat(promptToSend);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: data.message,
          movies: data.movies || []
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          text: "Sorry, I had trouble curating that right now. Please try asking again in a different way!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl h-[85vh] max-h-[700px] flex flex-col bg-dark-surface border border-dark-border rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border/60 bg-dark-card/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                CineMatch AI Assistant
                <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-semibold tracking-wide uppercase">
                  Beta
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Ask naturally for any mood, trope, or constraints</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-border/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-600 text-white rounded-br-none"
                    : "bg-dark-card border border-dark-border text-slate-200 rounded-bl-none shadow-md"
                }`}
              >
                <p>{msg.text}</p>

                {/* Suggestions Chips */}
                {msg.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-dark-border/60">
                    {msg.suggestions.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(s)}
                        className="text-left text-xs px-3 py-1.5 rounded-xl bg-dark-surface border border-dark-border hover:border-brand-500 text-slate-300 hover:text-white transition-colors"
                      >
                        💡 "{s}"
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Movie Recommendations Cards */}
              {msg.movies && msg.movies.length > 0 && (
                <div className="mt-3 w-full grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {msg.movies.map((movie) => {
                    const poster = movie.poster_url || (movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null);
                    return (
                      <div
                        key={movie.id}
                        className="bg-dark-card border border-dark-border/80 rounded-xl overflow-hidden shadow-lg group hover:border-brand-500/50 transition-all flex flex-col"
                      >
                        <div className="relative aspect-[2/3] w-full bg-dark-surface overflow-hidden">
                          {poster ? (
                            <img src={poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs text-center p-2">
                              {movie.title}
                            </div>
                          )}
                          {movie.vote_average > 0 && (
                            <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-amber-400">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              {Number(movie.vote_average).toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-2.5 flex flex-col justify-between flex-1">
                          <Link
                            to={`/movie/${movie.id}`}
                            onClick={onClose}
                            className="text-xs font-semibold text-white group-hover:text-brand-500 line-clamp-1"
                          >
                            {movie.title}
                          </Link>
                          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                            <span>{movie.release_date?.split("-")[0]}</span>
                            <Link
                              to={`/movie/${movie.id}`}
                              onClick={onClose}
                              className="text-brand-500 hover:text-brand-400 font-medium"
                            >
                              View →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 bg-dark-card border border-dark-border rounded-2xl w-fit text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
              <span>Analyzing constraints & searching TMDB...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-dark-border/60 bg-dark-card/40 backdrop-blur-md shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 'I want a gripping crime drama with a plot twist'"
              className="flex-1 px-4 py-2.5 bg-dark-surface border border-dark-border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white transition-all shadow-md shadow-brand-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
