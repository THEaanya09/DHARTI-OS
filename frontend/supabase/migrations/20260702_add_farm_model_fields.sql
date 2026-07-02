-- Add ML model input fields to profiles (run in Supabase SQL Editor)
alter table public.profiles
  add column if not exists state_name text,
  add column if not exists season text,
  add column if not exists annual_rainfall numeric,
  add column if not exists fertilizer_kg numeric,
  add column if not exists pesticide_kg numeric,
  add column if not exists land_cover text default 'Agricultural',
  add column if not exists soil_type text default 'Loam',
  add column if not exists elevation_m numeric,
  add column if not exists near_river boolean default false,
  add column if not exists historical_floods numeric default 0,
  add column if not exists soil_n numeric,
  add column if not exists soil_p numeric,
  add column if not exists soil_k numeric,
  add column if not exists soil_ph numeric,
  add column if not exists expected_rainfall_mm numeric,
  add column if not exists area_unit text default 'acres';
