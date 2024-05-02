// components/BookmarkButton.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Adjust path as needed
import { useUser } from "../context/UserContext"; // Adjust path as needed

const ShareButton = ({}) => {
  return (
    <button className="text-gray-500 dark:text-zinc-300/60 hover:text-sky-400 rounded-full p-2 hover:bg-sky-100 active:bg-sky-200 active:text-sky-500 dark:hover:bg-zinc-600/50 dark:active:bg-zinc-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-share-2"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1" />
        <path d="M12 14v-11" />
        <path d="M9 6l3 -3l3 3" />
      </svg>
    </button>
  );
};

export default ShareButton;
