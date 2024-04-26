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
    <div className="flex items-center py-3 px-4 shadow">
      <span
        className="text-lg font-bold text-black"
        style={{ paddingLeft: "2rem" }}
      >
        Optimal
      </span>{" "}
      <div
        className="absolute right-6 flex pr-6"
      >
        {user ? (
          <>
            <button
              onClick={openSubmitModal}
              className="px-4 py-2 text-left mx-2 text-sm text-white font-semibold bg-teal-500 hover:bg-teal-600 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Submit a Resource
            </button>
            <ProfileDropdown />
          </>
        ) : (
          <button
            onClick={handleSignInClick}
            className="bg-teal-500 text-white hover:bg-teal-600 font-semibold text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            Sign in
          </button>
        )}
        <SubmitModal isOpen={isModalOpen} setIsOpen={setModalOpen} />
        <AuthModal opened={authModalOpened} setOpened={setAuthModalOpened} />
      </div>
    </div>
  );
};

export default AppHeader;
