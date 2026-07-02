const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase URL or Service Role Key is not set in .env.local.');
  process.exit(1);
}

console.log(`Connecting to Supabase at: ${supabaseUrl}...`);
// Create client using elevated service role key to inspect schema and auth
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function runTests() {
  console.log('\n--- Running Supabase Verification Tests ---');

  // Test 1: Connection & Auth Service handshake
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('❌ Test 1 (Auth Handshake) Failed:', authError.message);
      process.exit(1);
    }
    console.log('✅ Test 1 (Auth Handshake) Successful: Connection is active.');
  } catch (err) {
    console.error('❌ Test 1 Unexpected Error:', err.message);
    process.exit(1);
  }

  // Test 2: Querying profiles table structure and read permissions
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      // Check if table does not exist
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        console.warn('⚠️ Test 2 Warning: "profiles" table was not found in the database schema.');
        console.log('👉 Please execute the SQL in "supabase/schema.sql" inside the Supabase SQL Editor to initialize the tables.');
      } else {
        console.error('❌ Test 2 (Query Profiles) Failed:', error.message);
      }
    } else {
      console.log('✅ Test 2 (Query Profiles) Successful: profiles table is queryable.');
      console.log('Current profile count in database:', data.length);
    }
  } catch (err) {
    console.error('❌ Test 2 Unexpected Error:', err.message);
  }

  console.log('-----------------------------------------\n');
}

runTests();
