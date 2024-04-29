"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserContextType, UserProviderProps, UserType } from '../types/types';
import { supabase } from '../lib/supabase';
import { uniqueNamesGenerator, adjectives, colors, animals, names } from "unique-names-generator";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
      // The user will be set in the onAuthStateChange handler.
    } catch (error) {
      console.error("Error with Google sign-in:", error);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user); // Set user on sign in
          checkUserProfile(session.user.id); // Check if user is new
        } else if (event === "SIGNED_OUT") {
          setUser(null); // Clear user on sign out
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUserProfile = async (userId: string) => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", userId);

      if (error && error.code !== "PGRST116") throw error;
      if (!profiles || profiles.length === 0) await handleNewUser(userId);
    } catch (error) {
      console.error("Error checking or creating user profile:", error);
    }
  };

  const handleNewUser = async (userId: string) => {
    const randomUsername = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals, names],
      length: 2,
      style: "lowerCase",
      separator: "_",
    });
    const uniqueDigits = userId.substring(0, 4);
    const finalUsername = `${randomUsername}${uniqueDigits}`;
    const profilePicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_images/default/default_o_cat.jpg`;

    const { error } = await supabase.from("profiles").upsert({
      user_id: userId,
      username: finalUsername,
      profile_pic_url: profilePicUrl,
    });

    if (error) console.error("Error creating profile for new user:", error);
  };

  return (
    <UserContext.Provider value={{ user, setUser, signInWithGoogle }}>
      {children}
    </UserContext.Provider>
  );
};

