"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../lib/supabase";
import { Resource } from "../types/types"; // Make sure this path is correct
import ResourceItem from "../components/ResourceItem"; // Make sure this path is correct

function TagPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ tags: string }>();
  const tag = params?.tags;
  const formattedTag = formatTagForDisplay(tag);

  function formatTagForDisplay(tag: string) {
    // Special cases mapping
    const specialCases: { [key: string]: string } = {
      javascript: "JavaScript",
      "html-css": "HTML/CSS",
      typescript: "TypeScript",
    };

    // If a special case exists, return it
    if (specialCases[tag.toLowerCase()]) {
      return specialCases[tag.toLowerCase()];
    }

    // Otherwise, capitalize the first letter and return
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  }

  useEffect(() => {
    if (!params?.tags) {
      setError("Tag is undefined");
      return;
    }

    const fetchResources = async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("approved", true)
        .containedBy("tags", [formattedTag]); // Assuming 'tags' is a text column

      if (error) {
        console.error("Error fetching resources:", error);
        setError("Failed to fetch resources");
      } else {
        setResources(data || []);
      }
    };

    fetchResources();
  }, [params?.tags]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative mt-1">
      {resources.length === 0 ? (
        <p>Oops! No resources found for this tag.</p>
      ) : (
        resources.map((resource) => (
          <ResourceItem key={resource.id} resource={resource} />
        ))
      )}
    </div>
  );
}

export default TagPage;
