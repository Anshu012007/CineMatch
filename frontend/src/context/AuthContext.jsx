import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check for saved demo user
      const storedDemo = localStorage.getItem("cinematch_demo_user");
      if (storedDemo) {
        try {
          setUser(JSON.parse(storedDemo));
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
      return;
    }

    // Live Supabase Auth
    async function initSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Error getting initial session:", err);
      } finally {
        setLoading(false);
      }
    }

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Email & Password Sign In
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      // Demo authentication
      const demoUser = {
        id: "demo-user-123",
        email,
        user_metadata: { full_name: email.split("@")[0] }
      };
      localStorage.setItem("cinematch_demo_user", JSON.stringify(demoUser));
      setUser(demoUser);
      showToast(`Signed in as ${demoUser.user_metadata.full_name} (Demo Mode)`);
      return { data: { user: demoUser }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showToast(error.message, "error");
      return { data: null, error };
    }

    showToast("Welcome back to CineMatch!");
    return { data, error: null };
  };

  // Email & Password Sign Up
  const signUp = async (email, password, displayName) => {
    if (!isSupabaseConfigured) {
      const demoUser = {
        id: "demo-user-123",
        email,
        user_metadata: { full_name: displayName || email.split("@")[0] }
      };
      localStorage.setItem("cinematch_demo_user", JSON.stringify(demoUser));
      setUser(demoUser);
      showToast(`Account created for ${demoUser.user_metadata.full_name} (Demo Mode)`);
      return { data: { user: demoUser }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName }
      }
    });

    if (error) {
      showToast(error.message, "error");
      return { data: null, error };
    }

    showToast("Registration successful! Check your email to confirm.");
    return { data, error: null };
  };

  // Google OAuth Login
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      // Demo google login
      const demoUser = {
        id: "demo-google-user-456",
        email: "alex.cinephile@gmail.com",
        user_metadata: {
          full_name: "Alex Cinephile",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        }
      };
      localStorage.setItem("cinematch_demo_user", JSON.stringify(demoUser));
      setUser(demoUser);
      showToast("Signed in with Google (Demo Mode)");
      return { data: { user: demoUser }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      showToast(error.message, "error");
      return { data: null, error };
    }

    return { data, error: null };
  };

  // Quick Demo User Switch
  const signInDemoUser = () => {
    const demoUser = {
      id: "demo-user-vip-999",
      email: "movie.buff@cinematch.app",
      user_metadata: {
        full_name: "Taylor Reel",
        avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
      }
    };
    localStorage.setItem("cinematch_demo_user", JSON.stringify(demoUser));
    setUser(demoUser);
    showToast("Logged in as Taylor Reel (Demo)");
  };

  // Sign Out
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      localStorage.removeItem("cinematch_demo_user");
      setUser(null);
      showToast("Signed out successfully");
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    showToast("Signed out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signInWithGoogle,
        signInDemoUser,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
