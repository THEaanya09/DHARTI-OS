import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Uses the elevated service role key (sb_secret_...) for server-only operations
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const getSupabaseServer = () => {
  if (!supabaseUrl || !supabaseSecretKey) {
    console.warn('Supabase URL or Service Role Key is missing in environment variables.');
  }
  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
