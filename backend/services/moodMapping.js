// Mood mappings to TMDB Genre IDs and filter criteria

export const MOOD_CONFIG = {
  happy: {
    label: "Happy",
    icon: "Smile",
    description: "Uplifting, heartwarming, and feel-good stories",
    genreIds: [35, 16, 10751], // Comedy, Animation, Family
    minRating: 7.0,
    accentColor: "from-amber-400 to-yellow-500"
  },
  sad: {
    label: "Sad",
    icon: "CloudRain",
    description: "Deep, emotional, tear-jerking dramas and romances",
    genreIds: [18, 10749], // Drama, Romance
    minRating: 7.2,
    accentColor: "from-blue-500 to-indigo-600"
  },
  scared: {
    label: "Scared",
    icon: "Ghost",
    description: "Chilling, hair-raising horrors and psychological thrillers",
    genreIds: [27, 53, 9648], // Horror, Thriller, Mystery
    minRating: 6.5,
    accentColor: "from-red-600 to-rose-900"
  },
  funny: {
    label: "Funny",
    icon: "Laugh",
    description: "Non-stop laughs, witty comedies, and pure humor",
    genreIds: [35], // Comedy
    minRating: 6.8,
    accentColor: "from-orange-400 to-amber-500"
  },
  excited: {
    label: "Excited",
    icon: "Flame",
    description: "Adrenaline-fueled action, grand adventures, and epic sci-fi",
    genreIds: [28, 12, 878], // Action, Adventure, Science Fiction
    minRating: 7.0,
    accentColor: "from-rose-500 to-purple-600"
  },
  relaxed: {
    label: "Relaxed",
    icon: "Coffee",
    description: "Calm, aesthetically pleasing documentaries, music, and quiet tales",
    genreIds: [99, 10402, 16], // Documentary, Music, Animation
    minRating: 7.0,
    accentColor: "from-emerald-500 to-teal-600"
  }
};

export function getMoodGenres(moodKey) {
  const normalized = (moodKey || "").toLowerCase();
  const config = MOOD_CONFIG[normalized];
  return config ? config.genreIds : [];
}

export function getAllMoods() {
  return Object.entries(MOOD_CONFIG).map(([key, value]) => ({
    id: key,
    ...value
  }));
}
