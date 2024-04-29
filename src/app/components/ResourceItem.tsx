"use client"

// ResourceItem.tsx
import { Resource, LikeState } from "../types/types";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";

function ResourceItem({ resource }: { resource: Resource }) {
  const [likes, setLikes] = useState(resource.likes);
  const [likeState, setLikeState] = useState<LikeState>("none");
  const { user } = useUser();

  const updateUserInteraction = async (action: LikeState) => {
    if (!user) return; // Ensure a user is logged in before proceeding

    const interactionPayload = {
      user_id: user.id,
      resource_id: resource.id,
      action: action, // 'liked', 'disliked', or 'none'
    };

    // Check if an interaction exists and update or insert accordingly
    const { data, error } = await supabase
      .from("user_likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("resource_id", resource.id);

    if (error) {
      console.error("Error fetching interaction:", error);
      return;
    }

    if (data.length > 0) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("user_likes")
        .update(interactionPayload)
        .match({ user_id: user.id, resource_id: resource.id });

      if (updateError) {
        console.error("Error updating interaction:", updateError);
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("user_likes")
        .insert([interactionPayload]);

      if (insertError) {
        console.error("Error inserting interaction:", insertError);
      }
    }
  };

  const updateLikes = async (newLikes: number) => {
    setLikes(newLikes);
    const { error } = await supabase
      .from("resources")
      .update({ likes: newLikes })
      .eq("id", resource.id);
    if (error) {
      console.error("Error updating likes:", error);
      setLikes(likes);
      setLikeState("none");
    }
  };

  const handleLike = async () => {
    let newLikes = likes;
    let newAction: LikeState = "none";
    if (likeState === "liked") {
      newLikes -= 1;
      newAction = "none";
    } else if (likeState === "disliked") {
      newLikes += 2;
      newAction = "liked";
    } else {
      newLikes += 1;
      newAction = "liked";
    }
    setLikeState(newAction);
    await updateLikes(newLikes);
    await updateUserInteraction(newAction);
  };

  const handleDislike = async () => {
    let newLikes = likes;
    let newAction: LikeState = "none";
    if (likeState === "disliked") {
      newLikes += 1;
      newAction = "none";
    } else if (likeState === "liked") {
      newLikes -= 2;
      newAction = "disliked";
    } else {
      newLikes -= 1;
      newAction = "disliked";
    }
    setLikeState(newAction);
    await updateLikes(newLikes);
    await updateUserInteraction(newAction);
  };

  useEffect(() => {
    const fetchUserInteraction = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("user_likes")
          .select("action")
          .eq("user_id", user.id)
          .eq("resource_id", resource.id);

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
  }, [user, resource.id]);

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
        className="icon icon-tabler icons-tabler-outline icon-tabler-heart-broken hover:fill-current"
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
        stroke="#F43F5E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon icon-tabler icons-tabler-outline icon-tabler-heart hover:fill-current"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
      </svg>
    );

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg mb-3 p-4">
    {/* Like & Dislike */}
      <div className="flex-col mr-3.5 text-center">
        <button
          className="flex items-center hover:text-rose-500"
          onClick={handleLike}
        >
          {likeIcon}
        </button>
        <span className="text-sm font-semibold">{likes}</span>
        <button
          className="flex items-center hover:text-gray-500"
          onClick={handleDislike}
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-hammer hover:fill-current"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M11.414 10l-7.383 7.418a2.091 2.091 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0l7.407 -7.385" />
            <path d="M18.121 15.293l2.586 -2.586a1 1 0 0 0 0 -1.414l-7.586 -7.586a1 1 0 0 0 -1.414 0l-2.586 2.586a1 1 0 0 0 0 1.414l7.586 7.586a1 1 0 0 0 1.414 0z" />
          </svg>
        </button>
      </div>
      {/* Thumbnail or Image */}
      <div className="flex-shrink-0">
        <img
          src={resource.image_url}
          alt=""
          className="h-28 w-28 object-cover rounded-lg"
        />
      </div>

      {/* Content Area */}
      <div className="ml-4 flex-1">
        <h3 className="font-semibold text-md leading-tight">
          {resource.title}
        </h3>
        <div className="mt-2 text-sm text-gray-700">
          <a
            href={resource.resource_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {resource.resource_url}
          </a>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Tags: {resource.tags.join(", ")}
        </div>

        {/* Actions or Meta info here */}
        <div className="mt-4 flex items-center space-x-4 text-gray-600 text-xs">
          {/* Placeholder for actions like upvote, comments etc */}
          <a
            href="#comments"
            className="flex items-center space-x-1 hover:text-gray-900"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 4 .01-18a2 2 0 012-2h2"></path>
            </svg>
            <span>Comments</span>
          </a>
          {/* More actions here */}
        </div>
      </div>
    </div>
  );
}

export default ResourceItem;

// Card view design:
{
  /* <div className="relative">
      <div className="relative w-full mx-auto p-4 rounded-lg overflow-hidden">
        <div className="relative">
          <h3 className="font-semibold text-lg">{resource.title}</h3>
          <div className="border border-gray-100 rounded-lg my-3 overflow-hidden">
            <div className="flex justify-center items-center w-full h-full">
              <img
                src={resource.image_url}
                alt=""
                className="max-h-80 w-full blur-xl opacity-100 rounded-lg "
              />
              <img
                src={resource.image_url}
                alt={""}
                className="rounded-lg absolute object-contain max-h-80 w-full"
                style={{ backdropFilter: "brightness(35%)" }}
              />
            </div>
          </div>
          <div>
            <a
              href={resource.resource_url}
              target="_blank"
              rel="noopener noreferrer"
              className=""
            ></a>
          </div>
        </div>
      </div>
      <div className="py-1">
        <div className="border border-gray-100"></div>
      </div>
    </div> */
}
