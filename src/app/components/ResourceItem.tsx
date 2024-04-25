// ResourceItem.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Resource } from "../types/types";

function ResourceItem({ resource }: { resource: Resource }) {
  return (
    <div className="relative">
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
                style={{ backdropFilter: 'brightness(35%)' }}
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
    </div>
  );
}

export default ResourceItem;
