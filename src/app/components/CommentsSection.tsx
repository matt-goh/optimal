// components/CommentsSection.js
import { CommentSectionProps, Resource, ResourceComment } from "../types/types";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";

const CommentsSection: React.FC<CommentSectionProps> = ({
  resource,
}: {
  resource: Resource;
}) => {
  const [comments, setComments] = useState<ResourceComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const { user } = useUser();

  const postComment = async () => {
    if (user) {
      const { data, error } = await supabase.from("comments").insert({
        user_id: user.id,
        resource_id: resource.id,
        content,
        likes: 0,
      });

      if (error) {
        console.error("Failed to post comment:", error.message);
      } else {
        console.log("Comment posted:", data);
        setContent(""); // Clear the editor after posting
      }
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        let { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*")
          .eq("resource_id", resource.id);

        if (commentsError) {
          console.error("Failed to fetch comments:", commentsError.message);
        } else {
          setComments(commentsData || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="relative flex mt-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border rounded-[20px] dark:bg-transparent sm:w-[38rem] md:w-[40rem] xl:w-[45rem] 2xl:w-[50rem] p-2 pl-4 dark:border-zinc-700"
        />
      </div>
      <div className="flex justify-end items-center mt-2">
        <div>
          <button
            className="mr-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            onClick={() => setContent("")}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={postComment}
          >
            Comment
          </button>
        </div>
      </div>
      <div className="mt-6">
        {comments.length === 0 ? (
          <></>
        ) : (
          comments.map((comment: ResourceComment) => (
            <div key="" className="mt-2">
              <p>{comment.content}</p>
              {/* Add more structured comment display here */}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CommentsSection;
