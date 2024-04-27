"use client";

import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import ProfileDropdown from "./ProfileDropdown";
import SubmitModal from "./SubmitModal";
import AuthModal from "./AuthModal";

const AppHeader = () => {
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useUser();

  const openSubmitModal = () => {
    setModalOpen(true); // Open the modal

    // Push the new state to history
    window.history.pushState({ modalOpened: true }, "", `/submit`);

    // Handle the back button when the modal is open
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.modalOpened) {
        setModalOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  };

  const handleSignInClick = () => {
    setAuthModalOpened(true);
  };

  return (
    <>
      <span className="text-lg font-bold text-black">Optimal</span>
      <div className="relative hidden lg:flex ml-auto space-x-6">
        {user ? (
          <>
            <button
              onClick={openSubmitModal}
              className="text-sm text-white font-semibold rounded-full p-2 px-6 bg-teal-500 hover:bg-teal-600 rounded shadow focus:outline-none ease-linear transition-all duration-150"
            >
              Submit a Resource
            </button>
            <ProfileDropdown />
          </>
        ) : (
          <button
            onClick={handleSignInClick}
            className="text-white bg-teal-500 hover:bg-teal-600 font-semibold p-2 px-6 text-sm rounded-full shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            Sign in
          </button>
        )}
        <SubmitModal isOpen={isModalOpen} setIsOpen={setModalOpen} />
        <AuthModal opened={authModalOpened} setOpened={setAuthModalOpened} />
      </div>
    </>
  );
};

export default AppHeader;
