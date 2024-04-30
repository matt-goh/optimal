"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Resource } from "@/app/types/types";
import CommentsSection from "@/app/components/CommentsSection";
import ResourceDetails from "@/app/components/ResourceDetails";

const ResourcePage = () => {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ resources: string }>();
  const { resources } = params;

  useEffect(() => {
    if (!resources) return;

    window.scrollTo(0, 0);
    // Assuming resources is the title from the URL, replace underscores with spaces and convert to title case
    const title = decodeURIComponent(resources).replace(/_/g, " ");

    const fetchResource = async () => {
      try {
        // Fetch the resource details
        let { data: resourceData, error: resourceError } = await supabase
          .from("resources")
          .select("*")
          .ilike("title", `%${title}%`)
          .single();

        if (resourceError) throw resourceError;

        setResource(resourceData);

      } catch (error) {
        setError("Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [resources]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <div className="relative pl-[2rem]">
      <ResourceDetails resource={resource} />
      <CommentsSection resource={resource}/>
    </div>
  );
};

export default ResourcePage;
