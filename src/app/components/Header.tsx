"use client";

import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import ProfileDropdown from "./ProfileDropdown";
import AuthModal from "./AuthModal";

const AppHeader = () => {
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const { user } = useUser();

  const handleSignInClick = () => {
    setAuthModalOpened(true);
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 shadow">
      <span className="text-lg font-bold text-black ml-10">Optimal</span>
      {user ? (
        <ProfileDropdown />
      ) : (
        <button
          onClick={handleSignInClick}
          className="bg-teal-500 text-white hover:bg-teal-600 font-semibold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
        >
          Sign in
        </button>
      )}
      <AuthModal opened={authModalOpened} setOpened={setAuthModalOpened} />
    </div>
  );
};

export default AppHeader;
