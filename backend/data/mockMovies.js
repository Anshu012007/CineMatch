// High-fidelity fallback movie dataset with official TMDB poster & backdrop paths
// Used whenever TMDB_API_KEY is not configured or network requests fail.

export const TMDB_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

export const MOCK_MOVIES = [
  {
    id: 157336,
    title: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34500,
    runtime: 169,
    genre_ids: [12, 18, 878],
    genres: [{ id: 12, name: "Adventure" }, { id: 18, name: "Drama" }, { id: 878, name: "Science Fiction" }],
    trailer_key: "zSWdZVtXT7E",
    director: "Christopher Nolan",
    cast: [
      { id: 10297, name: "Matthew McConaughey", character: "Joseph Cooper", profile_path: "/wDeLDeDq0Xy4d35jF9vYvA7i8V9.jpg" },
      { id: 1813, name: "Anne Hathaway", character: "Dr. Amelia Brand", profile_path: "/tLpq597i2qKj3B0y4N2H3L6Qe8Z.jpg" },
      { id: 83002, name: "Jessica Chastain", character: "Murphy Cooper", profile_path: "/vO59Ntrw2U3pM2E1qT0g5g6c7E9.jpg" },
      { id: 3895, name: "Michael Caine", character: "Professor John Brand", profile_path: "/klNx0Jz8aL6K2mP3rF8lO4k1E9X.jpg" }
    ],
    similar_ids: [27205, 603, 19995, 335984]
  },
  {
    id: 27205,
    title: "Inception",
    tagline: "Your mind is the scene of the crime.",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
    poster_path: "/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 36000,
    runtime: 148,
    genre_ids: [28, 12, 878],
    genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 878, name: "Science Fiction" }],
    trailer_key: "YoHD9XEInc0",
    director: "Christopher Nolan",
    cast: [
      { id: 6193, name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
      { id: 24045, name: "Joseph Gordon-Levitt", character: "Arthur", profile_path: "/dhv9V8B0V0t4n6l8b7M8J6g4G6H.jpg" },
      { id: 27578, name: "Elliot Page", character: "Ariadne", profile_path: "/e033eL5Zg1N1j2O8X6J1h8s6j2N.jpg" },
      { id: 2524, name: "Tom Hardy", character: "Eames", profile_path: "/d8MbU3Wz7gh4n6m9N8j6G5b3v2X.jpg" }
    ],
    similar_ids: [157336, 603, 694, 335984]
  },
  {
    id: 603,
    title: "The Matrix",
    tagline: "Welcome to the Real World.",
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/ncEWFZ8KnAnFLmKLJiqEfZeKuYZ.jpg",
    release_date: "1999-03-30",
    vote_average: 8.2,
    vote_count: 25400,
    runtime: 136,
    genre_ids: [28, 878],
    genres: [{ id: 28, name: "Action" }, { id: 878, name: "Science Fiction" }],
    trailer_key: "vKQi3bBA1y8",
    director: "Lana & Lilly Wachowski",
    cast: [
      { id: 6384, name: "Keanu Reeves", character: "Thomas A. Anderson / Neo", profile_path: "/4D0PpNI0kmP58hgrwGC3UBTVYPv.jpg" },
      { id: 2975, name: "Laurence Fishburne", character: "Morpheus", profile_path: "/8suOhUmPbfKqY17iSrxKn9g6G.jpg" },
      { id: 530, name: "Carrie-Anne Moss", character: "Trinity", profile_path: "/87WvLg6n0N8lO7M3X6d4E8w7g4B.jpg" }
    ],
    similar_ids: [27205, 157336, 335984]
  },
  {
    id: 155,
    title: "The Dark Knight",
    tagline: "Welcome to a world without rules.",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 32000,
    runtime: 152,
    genre_ids: [18, 28, 80, 53],
    genres: [{ id: 18, name: "Drama" }, { id: 28, name: "Action" }, { id: 80, name: "Crime" }, { id: 53, name: "Thriller" }],
    trailer_key: "EXeTwQWrcwY",
    director: "Christopher Nolan",
    cast: [
      { id: 3894, name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "/b7fTC9WFkgq6O87OGikOk0qGRAP.jpg" },
      { id: 1810, name: "Heath Ledger", character: "Joker", profile_path: "/5Y9HnYYa9jF4NuY9l0G2A4xM5wB.jpg" },
      { id: 3895, name: "Michael Caine", character: "Alfred Pennyworth", profile_path: "/klNx0Jz8aL6K2mP3rF8lO4k1E9X.jpg" }
    ],
    similar_ids: [27205, 603, 550]
  },
  {
    id: 496243,
    title: "Parasite",
    tagline: "Act like you own the place.",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
    release_date: "2019-05-30",
    vote_average: 8.5,
    vote_count: 17800,
    runtime: 132,
    genre_ids: [35, 53, 18],
    genres: [{ id: 35, name: "Comedy" }, { id: 53, name: "Thriller" }, { id: 18, name: "Drama" }],
    trailer_key: "5xH0hhMB8GE",
    director: "Bong Joon-ho",
    cast: [
      { id: 20738, name: "Song Kang-ho", character: "Kim Ki-taek", profile_path: "/l9iJ5vC7xM0d2e4g8F3c7v2k1M6.jpg" },
      { id: 1253360, name: "Lee Sun-kyun", character: "Park Dong-ik", profile_path: "/6hL3k8g8v0N5p9D2h6M1j8k3V7R.jpg" }
    ],
    similar_ids: [550, 694, 155]
  },
  {
    id: 129,
    title: "Spirited Away",
    tagline: "Tunnel to a mystical world.",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_path: "/mSDvdv1bXp6wF2K2M4l0H9XvV4Z.jpg",
    release_date: "2001-07-20",
    vote_average: 8.5,
    vote_count: 16000,
    runtime: 125,
    genre_ids: [16, 10751, 14],
    genres: [{ id: 16, name: "Animation" }, { id: 10751, name: "Family" }, { id: 14, name: "Fantasy" }],
    trailer_key: "ByXuk9QqQkk",
    director: "Hayao Miyazaki",
    cast: [
      { id: 19588, name: "Rumi Hiiragi", character: "Chihiro Ogino (voice)", profile_path: "/b0J2K9k8v0N5p9D2h6M1j8k3V7R.jpg" }
    ],
    similar_ids: [372058, 493529]
  },
  {
    id: 372058,
    title: "Your Name.",
    tagline: "I am looking for you, whom I have never met.",
    overview: "High schoolers Mitsuha and Taki are complete strangers living separate lives in different parts of Japan. But one night, they suddenly switch places. Mitsuha wakes up in Taki's body, and he in hers. This bizarre occurrence continues to happen randomly, and the two must adjust their lives around each other.",
    poster_path: "/q719jXXEzOoYaps6qFsVoMe0qtn.jpg",
    backdrop_path: "/dIWwZW7dJJ1qC6CFsVjYAc14y6c.jpg",
    release_date: "2016-08-26",
    vote_average: 8.5,
    vote_count: 11000,
    runtime: 106,
    genre_ids: [16, 10749, 18],
    genres: [{ id: 16, name: "Animation" }, { id: 10749, name: "Romance" }, { id: 18, name: "Drama" }],
    trailer_key: "s0wTdCQoc8A",
    director: "Makoto Shinkai",
    cast: [
      { id: 1609117, name: "Ryunosuke Kamiki", character: "Taki Tachibana (voice)", profile_path: "/7k2K9k8v0N5p9D2h6M1j8k3V7R.jpg" }
    ],
    similar_ids: [129, 493529]
  },
  {
    id: 694,
    title: "The Shining",
    tagline: "He came as the caretaker, but this hotel had its own caretakers.",
    overview: "Jack Torrance accepts a caretaker job at the Overlook Hotel, where he, along with his wife Wendy and their son Danny, must live isolated from the rest of the world for the winter. But they aren't prepared for the madness that lurks within.",
    poster_path: "/xazWoLealQwEgqZ89MLZklLZD3k.jpg",
    backdrop_path: "/mmd1HnuvAzrmqII9rutJ9RlaRwV.jpg",
    release_date: "1980-05-23",
    vote_average: 8.2,
    vote_count: 17200,
    runtime: 146,
    genre_ids: [27, 53],
    genres: [{ id: 27, name: "Horror" }, { id: 53, name: "Thriller" }],
    trailer_key: "S014446AA1M",
    director: "Stanley Kubrick",
    cast: [
      { id: 514, name: "Jack Nicholson", character: "Jack Torrance", profile_path: "/9g8hL2M8b0v9N8l4K6f1M2B5C7D.jpg" },
      { id: 1032, name: "Shelley Duvall", character: "Wendy Torrance", profile_path: "/4l2M8b0v9N8l4K6f1M2B5C7D8E9.jpg" }
    ],
    similar_ids: [496243, 550]
  },
  {
    id: 550,
    title: "Fight Club",
    tagline: "Mischief. Mayhem. Soap.",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 28500,
    runtime: 139,
    genre_ids: [18],
    genres: [{ id: 18, name: "Drama" }],
    trailer_key: "qtRKdVHc-cE",
    director: "David Fincher",
    cast: [
      { id: 819, name: "Edward Norton", character: "The Narrator", profile_path: "/5G0vB6k8V0t4n6l8b7M8J6g4G6H.jpg" },
      { id: 287, name: "Brad Pitt", character: "Tyler Durden", profile_path: "/cckcYc2v0vmngUbflTrlaFRvAw3.jpg" },
      { id: 1283, name: "Helena Bonham Carter", character: "Marla Singer", profile_path: "/DDe7HnYYa9jF4NuY9l0G2A4xM5w.jpg" }
    ],
    similar_ids: [27205, 155, 496243]
  },
  {
    id: 493529,
    title: "Dungeons & Dragons: Honor Among Thieves",
    tagline: "Who needs heroes when you have thieves?",
    overview: "A charming thief and a band of unlikely adventurers embark on an epic heist to retrieve a lost relic, but things go dangerously awry when they run afoul of the wrong people.",
    poster_path: "/v7UF7PpJsAvPVegRiYXPaLdnzqT.jpg",
    backdrop_path: "/a2tUkQgHQCbdUvtIlpqItYs4A11.jpg",
    release_date: "2023-03-23",
    vote_average: 7.4,
    vote_count: 3100,
    runtime: 134,
    genre_ids: [12, 14, 35],
    genres: [{ id: 12, name: "Adventure" }, { id: 14, name: "Fantasy" }, { id: 35, name: "Comedy" }],
    trailer_key: "IiMinixSXII",
    director: "Jonathan Goldstein, John Francis Daley",
    cast: [
      { id: 62064, name: "Chris Pine", character: "Edgin Darvis", profile_path: "/ipHNp2K8v0N5p9D2h6M1j8k3V7R.jpg" },
      { id: 17647, name: "Michelle Rodriguez", character: "Holga Kilgore", profile_path: "/uGgL3k8g8v0N5p9D2h6M1j8k3V7.jpg" }
    ],
    similar_ids: [129, 372058]
  },
  {
    id: 335984,
    title: "Blade Runner 2049",
    tagline: "There's still a page left.",
    overview: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos. K's discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.",
    poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdrop_path: "/ilRyAZw9vcf95gqO762bO84iZ7J.jpg",
    release_date: "2017-10-04",
    vote_average: 8.0,
    vote_count: 13200,
    runtime: 164,
    genre_ids: [878, 18, 9648],
    genres: [{ id: 878, name: "Science Fiction" }, { id: 18, name: "Drama" }, { id: 9648, name: "Mystery" }],
    trailer_key: "gCcx85zbxz4",
    director: "Denis Villeneuve",
    cast: [
      { id: 30614, name: "Ryan Gosling", character: "Officer K", profile_path: "/4Xy2K9k8v0N5p9D2h6M1j8k3V7R.jpg" },
      { id: 3, name: "Harrison Ford", character: "Rick Deckard", profile_path: "/5L2M8b0v9N8l4K6f1M2B5C7D8E9.jpg" }
    ],
    similar_ids: [157336, 27205, 603]
  },
  {
    id: 19995,
    title: "Avatar",
    tagline: "Enter the world of Pandora.",
    overview: "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    poster_path: "/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    backdrop_path: "/vL5LR6WdxWPjC3U4wD6v149r5kX.jpg",
    release_date: "2009-12-15",
    vote_average: 7.6,
    vote_count: 31000,
    runtime: 162,
    genre_ids: [28, 12, 14, 878],
    genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 14, name: "Fantasy" }, { id: 878, name: "Science Fiction" }],
    trailer_key: "5PSNL1qE6VY",
    director: "James Cameron",
    cast: [
      { id: 65731, name: "Sam Worthington", character: "Jake Sully", profile_path: "/mfl9Ntrw2U3pM2E1qT0g5g6c7E9.jpg" },
      { id: 8691, name: "Zoe Saldaña", character: "Neytiri", profile_path: "/uGgL3k8g8v0N5p9D2h6M1j8k3V7.jpg" }
    ],
    similar_ids: [157336, 27205]
  }
];
