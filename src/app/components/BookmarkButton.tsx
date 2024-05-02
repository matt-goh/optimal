import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";
import { BookmarkButtonProps } from "../types/types";

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ resourceId }) => {
  const { user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user) {
      checkBookmark();
    }
  }, [user, resourceId]);

  const checkBookmark = async () => {
    const { data, error } = await supabase
      .from("user_actions")
      .select("id")
      .eq("user_id", user?.id)
      .eq("resource_id", resourceId)
      .eq("action", "bookmark");

    if (error) {
      console.error("Error fetching bookmark:", error);
    } else {
      setIsBookmarked(data.length > 0);
    }
  };

  const toggleBookmark = async () => {
    if (isBookmarked) {
      await removeBookmark();
    } else {
      await addBookmark();
    }
  };

  const addBookmark = async () => {
    const { error } = await supabase.from("user_actions").insert([
      {
        user_id: user?.id,
        resource_id: resourceId,
        action: "bookmark",
      },
    ]);

    if (error) {
      console.error("Error adding bookmark:", error);
    } else {
      setIsBookmarked(true);
    }
  };

  const removeBookmark = async () => {
    const { error } = await supabase.from("user_actions").delete().match({
      user_id: user?.id,
      resource_id: resourceId,
      action: "bookmark",
    });

    if (error) {
      console.error("Error removing bookmark:", error);
    } else {
      setIsBookmarked(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      aria-pressed={isBookmarked}
      className="text-gray-500 dark:text-zinc-300/60 hover:text-sky-400 rounded-full p-2 hover:bg-sky-100 active:bg-sky-200 active:text-sky-500 dark:hover:bg-zinc-600/50 dark:active:bg-zinc-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={isBookmarked ? "#38BDF8" : "none"}
        stroke={isBookmarked ? "#38BDF8" : "none"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`icon icon-tabler icons-tabler-outline icon-tabler-bookmark ${
          isBookmarked ? "" : "stroke-current"
        }`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
      </svg>
    </button>
  );
};

export default BookmarkButton;
