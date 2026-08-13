const { createClient } = require("@supabase/supabase-js");

// Validate required environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL environment variable is required");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required");
}

// Log for debugging (do not log the actual key)
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Service Role Key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('Service Role Key prefix:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + '...');

// Create Supabase client with service role key for server-side database operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  }
);

// Create separate Supabase client for authentication operations
// This prevents auth calls from contaminating the service role client context
const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = { supabase, supabaseAuth };