<<<<<<< HEAD
# CineMatch 🎬🍿

**CineMatch** is a movie recommendation web application built with a modern, high-performance stack:
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend**: Node.js, Express, Axios, CORS, Dotenv
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security & Auth)
- **Movie Catalog**: TMDB API (The Movie Database) with built-in high-fidelity fallback
- **Phase 2 Intelligence**: AI Movie Assistant (Gemini / LLM) & Group Recommendation Matcher

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v8.0.0 or higher)

### 2. Install Dependencies
You can install everything from the root directory:
```bash
npm run install:all
```
*Or install separately:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables
Copy the example environment files:

#### Backend (`/backend/.env`):
```bash
cd backend
cp .env.example .env
```
Inside `backend/.env`:
```env
PORT=5000
# Get your free TMDB API Key from https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_tmdb_api_key_here

# Optional: Google Gemini API Key for AI Assistant (Phase 2)
# Get a free key at https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: Even without a TMDB key, CineMatch includes a comprehensive fallback mock database so you can immediately experience all features (trending, filters, search, details, mood recommendations)!

#### Frontend (`/frontend/.env`):
```bash
cd frontend
cp .env.example .env
```
Inside `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api

# Get your free Supabase credentials from https://supabase.com/dashboard
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
> **Note**: If Supabase keys are not set, CineMatch automatically runs in **Demo / Guest Mode** using browser storage. You can test watchlists and favorites right away!

### 4. Run Locally
Run both backend and frontend concurrently with a single command:
```bash
npm run dev
```
Or run them in separate terminal windows:
- Backend: `npm run dev:backend` (runs on `http://localhost:5000`)
- Frontend: `npm run dev:frontend` (runs on `http://localhost:5173`)

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🗄️ Database Setup (Supabase)
To enable cloud sync for user accounts, watchlists, and favorites:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase_schema.sql` from this repository, paste the contents, and click **Run**.
4. Copy your **Project URL** and **anon public key** from Project Settings > API, and paste them into `frontend/.env`.
5. *(Optional Google OAuth)*: Under Authentication > Providers > Google, enable Google login by supplying your Google Client ID and Secret.

---

## 📁 Repository Structure
```
cinematch/
├── package.json               # Root monorepo scripts
├── supabase_schema.sql        # Supabase Postgres schema & RLS policies
├── README.md                  # Complete documentation
├── backend/
│   ├── package.json
│   ├── server.js              # Express app entry point
│   ├── .env.example
│   ├── data/
│   │   └── mockMovies.js      # High-fidelity mock movie dataset
│   ├── services/
│   │   ├── tmdbService.js     # TMDB API proxy + cache + fallback
│   │   ├── moodMapping.js     # Mood-to-genre curation logic
│   │   └── aiAssistantService.js # AI natural language movie assistant
│   └── routes/
│       ├── movies.js          # Movie catalog endpoints
│       ├── ai.js              # AI assistant endpoints
│       └── group.js           # Multi-user group matching
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── api/client.js      # Axios/Fetch API client
        ├── lib/supabase.js    # Supabase SDK wrapper
        ├── context/           # Auth, MovieLists, and Toast providers
        ├── components/        # Hero, MovieCard, TrailerModal, etc.
        └── pages/             # Home, MovieDetails, Search, Explore, Profile, Group
```
=======
# CineMatch
Repository for movie recommendation website
>>>>>>> 925897b3b2ad6c2ed15a2016cd0450f621bca5dc
