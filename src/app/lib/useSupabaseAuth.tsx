import { useState } from "react";
import { supabase } from "./supabase"; // ensure this points to your Supabase client initialization file
import { Provider } from "@supabase/supabase-js"; // Import types for provider

export const useSupabaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Specify string or null for error

  const signInWithProvider = async (provider: Provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (err: any) {
      // Catch clause variable type annotation
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: any) {
      // Catch clause variable type annotation
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (err: any) {
      // Catch clause variable type annotation
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithProvider,
    signIn,
    signUp,
    loading,
    error,
    setError, // Allow resetting error from the component if needed
  };
};
