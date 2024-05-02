"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";
import { Resource } from "../types/types";

interface BookmarkedResource extends Resource {
  bookmarked_at: string; // Ensuring this matches the property we expect
}

const BookmarkedSidebar: React.FC = () => {
  const { user } = useUser();
  const [bookmarkedResources, setBookmarkedResources] = useState<
    BookmarkedResource[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarkedResources();
    }
  }, [user]);

  const fetchBookmarkedResources = async () => {
    const { data, error } = await supabase
      .from("user_actions")
      .select(
        "created_at, resources(id, title, resource_url, image_url, resource_type, created_at, likes)"
      )
      .eq("user_id", user?.id)
      .eq("action", "bookmark");

    if (error) {
      console.error("Error fetching bookmarked resources:", error);
      setBookmarkedResources([]); // Ensures list is cleared on error
    } else {
      const transformedData = data.map((d) => ({
        ...d.resources,
        bookmarked_at: d.created_at,
      }));

      setBookmarkedResources(
        transformedData as unknown as BookmarkedResource[]
      );
      setLoading(false);
    }
  };

  if (loading) return <div>Loading bookmarks...</div>;

  return (
    <aside className="w-full px-4">
      <div>
        <h2 className="text-lg font-semibold dark:text-zinc-200">Bookmarked Resources</h2>
        {bookmarkedResources.length > 0 ? (
          <ul className="mt-4">
            {bookmarkedResources.map((resource) => (
              <a
                href={`/resource/${resource.title}`}
                className="dark:hover:text-zinc-300 hover:text-black-900"
              >
                <li
                  key={resource.id}
                  className="mt-2 p-4 border rounded-lg border-gray-200 dark:border-zinc-700"
                >
                  <div className="flex text-sm justify-between items-center">
                    <div className="flex-col pr-4">
                      <span className="hover:underline">{resource.title}</span>
                    </div>
                    <img
                      src={resource.image_url}
                      alt={""}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  </div>
                  <span className="flex justify-start items-end text-sm">
                    {resource.likes} likes
                  </span>
                </li>
              </a>
            ))}
          </ul>
        ) : (
          <div className="mt-2 text-gray-400">
            Bookmarked resources will be displayed here.
          </div>
        )}
      </div>
    </aside>
  );
};

export default BookmarkedSidebar;
