-- ====================================================================
-- CineMatch: Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ====================================================================

-- 1. Create the user_movies table for Watchlist, Favorites, and Watched lists
create table if not exists public.user_movies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  movie_id integer not null,
  movie_title text not null,
  poster_path text,
  backdrop_path text,
  release_date text,
  vote_average numeric(3,1),
  genres jsonb default '[]'::jsonb,
  list_type text check (list_type in ('watchlist', 'favorites', 'watched')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, movie_id, list_type)
);

-- 2. Enable Row Level Security (RLS)
alter table public.user_movies enable row level security;

-- 3. Policy: Users can select only their own movie records
create policy "Users can view their own movie records"
  on public.user_movies
  for select
  using (auth.uid() = user_id);

-- 4. Policy: Users can insert their own movie records
create policy "Users can insert their own movie records"
  on public.user_movies
  for insert
  with check (auth.uid() = user_id);

-- 5. Policy: Users can update their own movie records
create policy "Users can update their own movie records"
  on public.user_movies
  for update
  using (auth.uid() = user_id);

-- 6. Policy: Users can delete their own movie records
create policy "Users can delete their own movie records"
  on public.user_movies
  for delete
  using (auth.uid() = user_id);

-- 7. Indexes for fast queries
create index if not exists idx_user_movies_user_id on public.user_movies(user_id);
create index if not exists idx_user_movies_list_type on public.user_movies(user_id, list_type);
