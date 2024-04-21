// ResourceItem.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Resource, Comment } from "../types/types";

function ResourceItem({ resource }: { resource: Resource }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("resource_id", resource.id);

      if (!error && data) {
        setComments(data);
      } else {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [resource.id]);

  const handleAddComment = async () => {
    const { data, error } = await supabase.from("comments").insert([
      {
        content: newComment,
        resource_id: resource.id,
        upvotes: 0,
        downvotes: 0,
      },
    ]);

    if (!error && data) {
      setComments((prevComments) => [...prevComments, ...data]);
      setNewComment("");
    } else {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="border p-4 mb-2 rounded-lg shadow">
      <h3 className="font-semibold text-lg">{resource.title}</h3>
      <img src={resource.image_link} alt={resource.title} className="max-w-xs" />
      <div>
        <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline">
          Learn More
        </a>
        <p>Tags: {resource.tags.join(", ")}</p>
      </div>
      <div>
        <h4>Comments</h4>
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-2 rounded my-1">
            <p>{comment.content}</p>
          </div>
        ))}
        <textarea
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button className="mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600" onClick={handleAddComment}>
          Post Comment
        </button>
      </div>
    </div>
  );
}

export default ResourceItem;
