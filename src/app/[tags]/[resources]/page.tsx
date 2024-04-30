"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Resource } from "../../types/types";
import { useParams } from "next/navigation";

function ResourcePage() {
  const [resource, setResource] = useState<Resource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ tags: string; resources: string }>();
  const { tags, resources } = params;
 console.log("tags", tags);
 console.log("resources", resources);
  // Converts URL-friendly string back to original title
  const formatTitleFromURL = (title: string) => {
    return title.replace(/_/g, " ");
  };

  useEffect(() => {
    if (!resources || !tags) {
      setError("Tag or resource is undefined");
      return;
    }

    const title = formatTitleFromURL(resources as string);

    const fetchResourceDetails = async () => {
      console.log("title", title);
      // Fetch resource details using the title and tag
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("title", title)
        .single(); // Assuming there's a unique constraint on titles

      if (error) {
        setError("Failed to fetch resource details");
        return;
      }

      setResource(data);
    };

    fetchResourceDetails();
  }, [params?.tags, resources, tags]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!resource) {
    return <div>Loading resource...</div>;
  }

  return (
    <div>
      <h1>{resource.title}</h1>
    </div>
  );
}

export default ResourcePage;
