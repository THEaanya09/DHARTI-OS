import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// A browser client using the anon key for public/authenticated operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
