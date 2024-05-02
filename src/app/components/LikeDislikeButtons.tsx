import { LikeDislikeButtonsProps, LikeState } from "../types/types";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";

const LikeDislikeButtons: React.FC<LikeDislikeButtonsProps> = ({
  resourceId,
  initialLikes,
}) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [likeState, setLikeState] = useState<LikeState>("none");
  const { user } = useUser();

  useEffect(() => {
    fetchUserInteraction();
  }, [user, resourceId]);

  const fetchUserInteraction = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("user_actions")
        .select("id, action")
        .eq("user_id", user.id)
        .eq("resource_id", resourceId);

      if (error) {
        console.error("Error fetching interaction:", error);
      } else {
        const currentAction = data.find(
          (d) => d.action === "liked" || d.action === "disliked"
        );
        setLikeState(currentAction ? currentAction.action : "none");
      }
    }
  };

  const handleLikeDislike = async (action: LikeState) => {
    if (!user) return;

    const currentAction = likeState;
    const isTogglingOff = action === currentAction;
    const newAction = isTogglingOff ? "none" : action;

    const { data, error } = await supabase
      .from("user_actions")
      .select("id, action")
      .eq("user_id", user.id)
      .eq("resource_id", resourceId);

    if (error) {
      console.error("Error fetching user actions:", error);
      return;
    }

    const existingAction = data.find(
      (d) => d.action === "liked" || d.action === "disliked"
    );
    if (existingAction) {
      if (isTogglingOff) {
        await supabase
          .from("user_actions")
          .delete()
          .match({ id: existingAction.id });
      } else {
        await supabase
          .from("user_actions")
          .update({ action: newAction })
          .match({ id: existingAction.id });
      }
    } else if (!isTogglingOff) {
      await supabase
        .from("user_actions")
        .insert([
          { user_id: user.id, resource_id: resourceId, action: newAction },
        ]);
    }

    const newLikes = calculateNewLikes(likes, currentAction, newAction);
    await updateLikesInDatabase(resourceId, newLikes);
    setLikes(newLikes);
    setLikeState(newAction);
  };

  const calculateNewLikes = (
    currentLikes: number,
    currentAction: string,
    newAction: string
  ) => {
    switch (currentAction) {
      case "liked":
        return newAction === "disliked" ? currentLikes - 2 : currentLikes - 1;
      case "disliked":
        return newAction === "liked" ? currentLikes + 2 : currentLikes + 1;
      default:
        return newAction === "liked"
          ? currentLikes + 1
          : newAction === "disliked"
          ? currentLikes - 1
          : currentLikes;
    }
  };

  const updateLikesInDatabase = async (
    resourceId: string,
    newLikes: number
  ) => {
    const { error } = await supabase
      .from("resources")
      .update({ likes: newLikes })
      .eq("id", resourceId);
    if (error) console.error("Failed to update likes in the database:", error);
  };

  // Determine which icon to display
  const likeIcon =
    likeState === "disliked" ? (
      // Heartbroken icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#F43F5E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-heart-broken"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        <path d="M12 6l-2 4l4 3l-2 4v3" />
      </svg>
    ) : (
      // Heart or filled heart icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={likeState === "liked" ? "#F43F5E" : "none"}
        stroke={likeState === "liked" ? "#F43F5E" : "#6B7280"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`icon icon-tabler icons-tabler-outline icon-tabler-heart ${
          likeState === "liked" ? "" : "stroke-current"
        }`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
      </svg>
    );

  return (
    <div className="flex items-center text-center space-x-1 rounded-full bg-zinc-200/50 dark:bg-zinc-600/20">
      <button
        className="flex items-center hover:bg-rose-100 hover:text-rose-500 active:text-rose-500 active:bg-rose-200 rounded-full p-2 text-gray-500 dark:hover:bg-zinc-600/50 dark:active:bg-zinc-600 dark:text-zinc-300/75"
        onClick={() => handleLikeDislike("liked")}
      >
        {likeIcon}
      </button>
      <span
        className={`text-sm dark:text-zinc-300/75 ${
          likes == -1 ? "px-[0.35rem]" : likes == 0 ? "" : "px-[0.525rem]"
        }`}
      >
        {likes == 0 ? "Like" : likes}
      </span>
      <button
        className="flex items-center hover:text-amber-500 active:text-amber-500 dark:text-zinc-300/75 hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-zinc-600/50 dark:active:bg-zinc-600 rounded-full p-2"
        onClick={() => handleLikeDislike("disliked")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={likeState === "disliked" ? "#F59E0B" : "none"}
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`icon icon-tabler icons-tabler-outline icon-tabler-hammer ${
            likeState === "disliked" ? "text-zinc-600/50" : "stroke-current"
          }`}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M11.414 10l-7.383 7.418a2.091 2.091 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0l7.407 -7.385" />
          <path d="M18.121 15.293l2.586 -2.586a1 1 0 0 0 0 -1.414l-7.586 -7.586a1 1 0 0 0 -1.414 0l-2.586 2.586a1 1 0 0 0 0 1.414l7.586 7.586a1 1 0 0 0 1.414 0z" />
        </svg>
      </button>
    </div>
  );
};

export default LikeDislikeButtons;
