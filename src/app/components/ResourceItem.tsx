
// ResourceItem.tsx
import { Resource } from "../types/types";
import LikeDislikeButtons from "./LikeDislikeButtons";
import React from "react";

function ResourceItem({ resource }: { resource: Resource }) {

  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg mb-3 p-4">
      {/* Thumbnail or Image */}
      <div className="flex-shrink-0">
        <img
          src={resource.image_url}
          alt=""
          className="h-32 w-32 object-cover rounded-lg"
        />
      </div>

      {/* Content Area */}
      <div className="ml-6 flex-1">
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

        <div className="mt-4 flex items-center space-x-4 text-gray-600 text-xs">
          {/* Placeholder for actions like upvote, comments etc */}
          {/* Like & Dislike */}
          <LikeDislikeButtons
            resourceId={resource.id}
            initialLikes={resource.likes}
          />
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
