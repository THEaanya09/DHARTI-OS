const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Use anon key for client signup test

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL or Anon Key is not set in .env.local.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  const previousUserId = '83b5fb60-e7be-4ba1-8fd1-e9f5f530de0a';
  
  console.log(`Checking if profile was created for previous user ID: ${previousUserId}...`);
  try {
    const serviceRoleClient = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: profile, error: profileError } = await serviceRoleClient
      .from('profiles')
      .select('*')
      .eq('id', previousUserId)
      .single();
    
    if (profileError) {
      console.error('❌ Trigger/Profile check failed:', profileError.message);
    } else {
      console.log('✅ Success! public.profiles row was successfully created by trigger:', profile);
    }
  } catch (err) {
    console.error('❌ Script execution error:', err.message);
  }
}

testSignup();
