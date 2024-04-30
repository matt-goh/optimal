import React, { useEffect, useState } from "react";
import { Resource } from "../types/types";
import LikeDislikeButtons from "./LikeDislikeButtons";

const ResourceDetails = ({ resource }: { resource: Resource }) => {
  const [imageClass, setImageClass] = useState("");

  useEffect(() => {
    if (resource.image_url) {
      const img = new Image();
      img.onload = () => {
        // Check if the image width is greater than its height
        if (img.width > img.height) {
          setImageClass("sm:w-[40rem] md:w-[40rem] xl:w-[40rem] 2xl:w-[38rem]");
        } else {
          setImageClass("sm:w-[38rem] md:w-[40rem] xl:w-[45rem] 2xl:w-[50rem]");
        }
      };
      img.src = resource.image_url;
    }
  }, [resource.image_url]);

  return (
    <>
      <div className="relative bg-white dark:bg-transparent justify-center flex-col">
        <h1 className="text-2xl font-bold">{resource.title}</h1>
        <p className="my-2">{resource.resource_type}</p>
        {resource.image_url && (
          <div className="my-[2rem]">
            <div className="flex justify-center items-center w-full h-full border border-zinc-200 dark:border-zinc-700 overflow-hidden rounded-lg">
              <img
                src={resource.image_url}
                alt=""
                className={`max-h-[30rem] blur-[28px] opacity-75 dark:opacity-50 rounded-lg ${imageClass}`}
              />
              <img
                src={resource.image_url}
                alt={""}
                className={`rounded-lg absolute object-contain max-h-[30rem] dark:backdrop-brightness-50 ${imageClass}`}
              />
            </div>
          </div>
        )}
      </div>
      <div className="relative flex">
        <LikeDislikeButtons
          resourceId={resource.id}
          initialLikes={resource.likes}
        />
      </div>
    </>
  );
};

export default ResourceDetails;
