import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://gzlmiplgwgzozmejiajv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bG1pcGxnd2d6b3ptZWppYWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzI2NDgsImV4cCI6MjA3MDI0ODY0OH0.-565NTkz3IM1fTRe4IgfqU7l0ZY28v7Es67odbXjLyw";

// Debug: Check if environment variable is loaded
if (!supabaseAnonKey) {
  console.error("❌ VITE_SUPABASE_ANON_KEY is missing!");
  console.error("Please add VITE_SUPABASE_ANON_KEY to your .env file");
} else {
  console.log("✅ Supabase anon key loaded successfully");
}

export const supabase = createClient(supabaseURL, supabaseAnonKey || "", {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

