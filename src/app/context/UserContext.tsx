"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserContextType, UserProviderProps, UserType } from "../types/types";
import { supabase } from "../lib/supabase";

const UserContext = createContext<UserContextType | null>({
  user: null,
  setUser: (user: UserType | null) => {}, // No-operation function for default
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Initialize user state from local storage
    try {
      const localUser = localStorage.getItem("supabase.auth.token");
      if (localUser) {
        const parsedUser = JSON.parse(localUser); // Safely parse the user data
        setUser(parsedUser?.user);
      }
    } catch (error) {
      console.log("No user data in local storage.");
      localStorage.removeItem("supabase.auth.token");
    }

    // Function to handle setting user state and local storage
    const updateUserState = (user: UserType | null) => {
      if (user) {
        localStorage.setItem("supabase.auth.token", JSON.stringify({ user }));
        setUser(user);
      } else {
        localStorage.removeItem("supabase.auth.token");
        setUser(null);
      }
    };

    // Check current session and update user state
    const checkUser = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      updateUserState(session?.session?.user as UserType);
    };

    // Execute on mount
    checkUser();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          updateUserState(session?.user as UserType);
        } else if (event === "SIGNED_OUT") {
          updateUserState(null);
        }
      }
    );

    // Cleanup: unsubscribe from listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
