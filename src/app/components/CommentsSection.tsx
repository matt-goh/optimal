import { CommentSectionProps, Resource, ResourceComment } from "../types/types";
import React, { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";

const CommentsSection: React.FC<CommentSectionProps> = ({
  resource,
}: {
  resource: Resource;
}) => {
  const [comments, setComments] = useState<ResourceComment[]>([]);
  const [isCommenting, setIsCommenting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const { user } = useUser();

  useEffect(() => {
    fetchComments();
  }, [resource.id]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          "id, user_id, resource_id, content, likes, created_at, profiles(username, profile_pic_url)"
        )
        .eq("resource_id", resource.id);

      if (error) {
        console.error("Failed to fetch comments:", error.message);
        setComments([]);
      } else {
        const transformedData = data.map((comment) => ({
          ...comment,
          profiles: comment.profiles
            ? comment.profiles
            : {
                username: "Anonymous",
                profile_pic_url:
                  "https://icwuwhijvlesjzisktiy.supabase.co/storage/v1/object/public/profile_images/default/default_o_cat.jpg",
              },
          timeAgo: formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
          }),
        }));
        setComments(transformedData as ResourceComment[]);
      }
    } catch (error) {
      console.error(error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async () => {
    if (user) {
      const { error } = await supabase.from("comments").insert({
        user_id: user.id,
        resource_id: resource.id,
        content,
        likes: 0,
      });

      if (error) {
        console.error("Failed to post comment:", error.message);
      } else {
        setContent("");
        fetchComments();
      }
    }
  };

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  useEffect(() => {
    handleResizeHeight();
  }, [content]);

  useEffect(() => {
    if (isCommenting && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isCommenting]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="relative flex mt-4">
        {!isCommenting ? (
          <button
            className="text-start text-sm text-zinc-500/75 border rounded-[20px] dark:bg-transparent sm:w-[38rem] md:w-[40rem] xl:w-[45rem] 2xl:w-[50rem] p-2 py-3 pl-4 border-zinc-300 dark:border-zinc-700 cursor-text"
            onClick={() => setIsCommenting(true)}
          >
            Add a comment
          </button>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-wrap border rounded-[20px] dark:bg-transparent text-sm sm:w-[38rem] md:w-[40rem] xl:w-[45rem] 2xl:w-[50rem] p-2 pl-4 border-zinc-300 dark:border-zinc-700 overflow-y-auto resize-y focus:ring-0 focus:outline-none focus:border-teal-500 caret-teal-500"
          />
        )}
      </div>
      {isCommenting && (
        <div className="flex justify-end items-center mt-2">
          <button
            className="mr-2 bg-zinc-200/75 dark:bg-zinc-600/25 rounded-full text-sm font-semibold py-2 px-3 rounded hover:bg-zinc-200 dark:hover:bg-zinc-600/50"
            onClick={() => {
              setContent("");
              setIsCommenting(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 text-sm font-semibold text-zinc-100 bg-teal-500 rounded-full hover:bg-teal-600 focus:outline-none"
            onClick={() => {
              postComment();
              setIsCommenting(false);
            }}
          >
            Comment
          </button>
        </div>
      )}
      <div className="mt-4">
        {comments.length === 0 ? (
          ""
        ) : (
          <div className="mt-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4">
                <div className="flex space-x-4">
                  <img
                    src={comment.profiles.profile_pic_url}
                    alt={`${comment.profiles.username}'s profile picture`}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-sm font-semibold">
                        {comment.profiles.username}
                      </h4>
                      <p className="text-xs text-gray-500 mx-1">•</p>
                      <time
                        dateTime={comment.created_at}
                        className="text-xs text-gray-500"
                      >
                        {comment.timeAgo}
                      </time>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{comment.likes} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CommentsSection;
