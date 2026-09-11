import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== "" &&
  !supabaseUrl.includes("your-project-id") &&
  supabaseAnonKey.trim() !== "" &&
  !supabaseAnonKey.includes("your-supabase-anon-key")
);

// Fallback dummy client if credentials are not configured yet
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: new Error("Supabase is in Demo Mode. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env to enable cloud auth.") }),
        signUp: async () => ({ error: new Error("Supabase is in Demo Mode. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env to enable cloud auth.") }),
        signInWithOAuth: async () => ({ error: new Error("Supabase is in Demo Mode. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env to enable Google OAuth.") }),
        signOut: async () => ({ error: null })
      },
      from: () => ({
        select: () => ({ eq: () => ({ data: [], error: null }) }),
        insert: () => ({ error: null }),
        delete: () => ({ eq: () => ({ eq: () => ({ error: null }) }) })
      })
    };
