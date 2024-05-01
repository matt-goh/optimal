import Link from "next/link";
import { Resource } from "../types/types";
import LikeDislikeButtons from "./LikeDislikeButtons";
import React from "react";

function ResourcePost({ resource }: { resource: Resource }) {
  // Helper function to format resource title to a URL-safe string
  const formatTitleForURL = (title: string) => {
    return encodeURIComponent(title.replace(/\s+/g, "_").toLowerCase());
  };

  const resourceCommentsUrl = `/resource/${formatTitleForURL(resource.title)}`;

  return (
    <div className="flex items-center relative bg-white dark:bg-transparent border border-gray-200 dark:border-zinc-700 rounded-lg mb-3 p-4 cursor-pointer dark:hover:bg-zinc-800">
      <Link href={resourceCommentsUrl} className="absolute inset-0 z-0"></Link>
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
        <div className="mt-2 text-sm text-gray-700 z-10 relative">
          <a
            href={resource.resource_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-sky-600"
            onClick={(e) => e.stopPropagation()}
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
          <div onClick={(e) => e.preventDefault()} className="cursor-auto z-10">
            <LikeDislikeButtons
              resourceId={resource.id}
              initialLikes={resource.likes}
            />
          </div>
          <Link
            href={resourceCommentsUrl}
            className="flex items-center space-x-1 hover:text-gray-900"
          ></Link>
          {/* More actions here */}
        </div>
      </div>
    </div>
  );
}

export default ResourcePost;

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
