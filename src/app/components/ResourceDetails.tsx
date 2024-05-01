import React, { useEffect, useRef, useState } from "react";
import { Resource } from "../types/types";
import LikeDislikeButtons from "./LikeDislikeButtons";

const ResourceDetails = ({ resource }: { resource: Resource }) => {
  const [imageClass, setImageClass] = useState("");
  const [backgroundImageClass, setBackgroundImageClass] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoaded = () => {
    const imgElement = imgRef.current;
    if (imgElement) {
      // Check if the image width is greater than its height
      if (imgElement.naturalWidth > imgElement.naturalHeight) {
        let newImgHeight = imgRef.current.clientHeight;
        setImageClass(`sm:w-[38rem] md:w-[40rem] xl:w-[45rem] 2xl:w-[50rem] h-[320px]`);
        setBackgroundImageClass(`h-[${newImgHeight}px]`);
      } else {
        setImageClass("sm:w-[38rem] md:w-[40rem] xl:w-[45rem] 2xl:w-[50rem] h-[460px]");
        setBackgroundImageClass("h-[460px]");
      } 
    }
  };

  return (
    <>
      <div className="relative bg-white dark:bg-transparent justify-center flex-col">
        <h1 className="text-2xl font-bold">{resource.title}</h1>
        <p className="my-2">{resource.resource_type}</p>
        {resource.image_url && (
          <div className="my-[2rem]">
            <div className="flex justify-center items-center w-full h-full border border-zinc-200 dark:border-zinc-800 overflow-hidden rounded-lg">
              <img
                src={resource.image_url}
                alt=""
                className={`blur-[28px] opacity-75 dark:opacity-50 rounded-lg sm:w-[38rem] md:w-[40rem] xl:w-[45rem] 2xl:w-[50rem] ${backgroundImageClass}`}
              />
              <img
                ref={imgRef}
                src={resource.image_url}
                alt={""}
                className={`rounded-lg absolute object-contain dark:backdrop-brightness-50 h-[320px] ${imageClass}`}
                onLoad={handleImageLoaded}
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
