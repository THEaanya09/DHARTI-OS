import { supabase } from './client';
import type { Locale, CropType, GeoLocation } from '@/types';

// ─── AUTHENTICATION OPERATIONS ──────────────────────────────────────────

/**
 * Signs up a new user with email and password.
 * Saves their display name and preferred language in raw_user_meta_data.
 */
export async function signUpWithEmail(email: string, password: string, name: string, locale: Locale = 'en') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        locale,
      },
    },
  });
  return { data, error };
}

/**
 * Signs in an existing user with email and password.
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Signs out the currently logged-in user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Retrieves the currently authenticated user's session.
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

/**
 * Retrieves the currently authenticated user details.
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// ─── PROFILE & ONBOARDING DATA SYNC ─────────────────────────────────────

/**
 * Fetches the user profile details from the public profiles table.
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

/**
 * Updates the user's preferred language and name in the profile.
 */
export async function updateProfile(userId: string, updates: { name?: string; preferred_lang?: Locale }) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

/**
 * Saves onboarding data: registers the first field (farm) and marks profile onboarded.
 */
export async function saveOnboardingData(
  userId: string,
  onboarding: {
    crop: CropType;
    area: number;
    area_unit: 'acres' | 'hectares';
    location: GeoLocation;
  }
) {
  // 1. Insert farm field details
  const { data: farm, error: farmError } = await supabase
    .from('farms')
    .insert({
      user_id: userId,
      crop: onboarding.crop,
      area: onboarding.area,
      area_unit: onboarding.area_unit,
      latitude: onboarding.location.lat,
      longitude: onboarding.location.lng,
      location_label: onboarding.location.label || 'Active Field',
    })
    .select()
    .single();

  if (farmError) return { farm: null, profile: null, error: farmError };

  // 2. Mark profile as onboarded
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update({ onboarded: true })
    .eq('id', userId)
    .select()
    .single();

  return { farm, profile, error: profileError };
}
