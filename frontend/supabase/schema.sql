-- =========================================================================
-- DHARTI AI — Supabase Database Schema
-- Run this script in the Supabase SQL Editor to initialize your database.
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── 1. PROFILES TABLE ───────────────────────────────────────────────────
drop table if exists public.profiles cascade;
drop trigger if exists on_auth_user_created on auth.users;

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text,
  language text default 'en',
  farm_name text,
  crop text,
  farm_area numeric,
  area_unit text default 'acres',
  latitude numeric,
  longitude numeric,
  state_name text,
  season text,
  annual_rainfall numeric,
  fertilizer_kg numeric,
  pesticide_kg numeric,
  land_cover text default 'Agricultural',
  soil_type text default 'Loam',
  elevation_m numeric,
  near_river boolean default false,
  historical_floods numeric default 0,
  soil_n numeric,
  soil_p numeric,
  soil_k numeric,
  soil_ph numeric,
  expected_rainfall_mm numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Users can read their own profile." on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

-- ─── 2. PROFILE TRIGGER ──────────────────────────────────────────────────
-- Automatically syncs auth.users insertions to profiles table
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'locale', 'en')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
