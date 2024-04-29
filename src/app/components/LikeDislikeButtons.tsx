// LikeDislikeButtons.js
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

  const updateLikesInDatabase = async (newLikes: number) => {
    setLikes(newLikes); // Optimistic UI update
    const { error } = await supabase
      .from("resources")
      .update({ likes: newLikes })
      .eq("id", resourceId);

    if (error) {
      console.error("Error updating likes:", error);
      setLikes(likes - newLikes); // Revert to old likes on error
    }
  };

  const updateUserInteraction = async (action: LikeState) => {
    if (!user) return;

    const interactionPayload = {
      user_id: user.id,
      resource_id: resourceId,
      action: action,
    };

    const { data, error } = await supabase
      .from("user_likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("resource_id", resourceId);

    if (data && data.length > 0) {
      await supabase
        .from("user_likes")
        .update(interactionPayload)
        .match({ user_id: user.id, resource_id: resourceId });
    } else {
      await supabase.from("user_likes").insert([interactionPayload]);
    }

    if (error) {
      console.error("Error updating interaction:", error);
    }
  };

  const handleLikeDislike = async (action: LikeState) => {
    let newLikes = likes;
    let newAction: LikeState = action;

    // User is toggling off their like/dislike
    if (likeState === action) {
      newAction = "none";
      newLikes += likeState === "liked" ? -1 : 1;
    } else {
      // Switching from like to dislike or vice versa
      if (likeState === "liked" && action === "disliked") {
        newLikes -= 2; // Removing like and adding dislike
      } else if (likeState === "disliked" && action === "liked") {
        newLikes += 2; // Removing dislike and adding like
      } else {
        // Adding a like or dislike for the first time
        newLikes += action === "liked" ? 1 : -1;
      }
    }

    setLikes(newLikes); // Optimistic UI update
    setLikeState(newAction);
    await updateLikesInDatabase(newLikes);
    await updateUserInteraction(newAction);
  };

  useEffect(() => {
    const fetchUserInteraction = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("user_likes")
          .select("action")
          .eq("user_id", user.id)
          .eq("resource_id", resourceId);

        if (error) {
          console.error("Error fetching interaction:", error);
        } else if (data && data.length > 0) {
          setLikeState(data[0].action);
        } else {
          setLikeState("none");
        }
      }
    };

    fetchUserInteraction();
  }, [user, resourceId]);

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
        className="icon icon-tabler icons-tabler-outline icon-tabler-heart stroke-current"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
      </svg>
    );

  return (
    <div className="flex items-center text-center space-x-1 rounded-full bg-gray-100">
      <button
        className="flex items-center hover:bg-rose-100 active:bg-rose-200 rounded-full p-2 hover:text-rose-500"
        onClick={() => handleLikeDislike("liked")}
      >
        {likeIcon}
      </button>
      <span className={`text-sm font-semibold ${likes == -1 ? "px-[0.45rem]" : likes == 0 ? "" : "px-2.5"}`}>
        {likes == 0 ? "Like" : likes}
      </span>
      <button
        className="flex items-center hover:text-gray-500 hover:bg-gray-200 active:bg-gray-300 rounded-full p-2"
        onClick={() => handleLikeDislike("disliked")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={likeState === "disliked" ? "#6B7280" : "none"}
          stroke="#6B7280"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-hammer"
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
