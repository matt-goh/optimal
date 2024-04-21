"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import { ToastContainer, toast } from "react-toastify";
import { supabase } from "../lib/supabase";
import { Resource, Suggestion, NewSuggestion } from "../types/types";

const SuggestionModal = ({}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const closeSuggestionModal = () => setShowSuggestionModal(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchSuggestions();
  }, []);

  const fetchResources = async () => {
    const { data, error } = await supabase.from("resources").select("*");

    if (error) {
      console.error("Error fetching resources:", error);
    } else {
      setResources(data);
    }
  };

  const fetchSuggestions = async () => {
    const { data, error } = await supabase.from("suggestions").select();
    if (error) {
      console.error("Error fetching suggestions:", error);
    } else {
      setSuggestions(data);
    }
  };

  const handleUpvote = async (resourceId: string) => {
    const { data, error } = await supabase
      .from("resources")
      .select("upvotes")
      .eq("id", resourceId)
      .single();

    if (error) {
      console.error("Error fetching upvotes:", error);
      return;
    }

    if (data) {
      const newUpvotes = data.upvotes + 1;

      const { error: updateError } = await supabase
        .from("resources")
        .update({ upvotes: newUpvotes })
        .eq("id", resourceId);

      if (updateError) {
        console.error("Error updating upvotes:", updateError);
      }
    }
  };

  const handleSuggestionSubmit = async (suggestion: NewSuggestion) => {
    try {
      const { error } = await supabase.from("suggestions").insert([suggestion]);
      if (error) throw error;

      toast.success("Suggestion submitted successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      toast.error("Failed to submit suggestion. Please try again later.");
    }
  };

  const handleApproveSuggestion = async (suggestionId: string) => {
    try {
      // Start a transaction
      const { data: suggestionData, error: suggestionError } = await supabase
        .from("suggestions")
        .select("*")
        .eq("id", suggestionId)
        .single();

      if (suggestionError) throw suggestionError;

      // Insert the suggestion into the resources table
      const { error: insertError } = await supabase.from("resources").insert([
        {
          title: suggestionData.title,
          link: suggestionData.link,
          image_link: suggestionData.image_link,
          resource_type: suggestionData.resource_type,
          tags: suggestionData.tags,
        },
      ]);

      if (insertError) throw insertError;

      // Optionally, delete the suggestion
      const { error: deleteError } = await supabase
        .from("suggestions")
        .delete()
        .eq("id", suggestionId);

      if (deleteError) throw deleteError;

      // Provide feedback
      toast.success("Suggestion approved and added to resources!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Refresh the lists
      fetchResources();
      fetchSuggestions();
    } catch (error) {
      console.error("Error in approving suggestion:", error);
      toast.error("Error approving suggestion. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleRejectSuggestion = async (suggestionId: string) => {
    try {
      // Delete the suggestion from the suggestions table
      const { error } = await supabase
        .from("suggestions")
        .delete()
        .match({ id: suggestionId });

      if (error) throw error;

      // Provide success feedback
      toast.success("Suggestion rejected successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Refresh the list of suggestions to remove the rejected item from the state
      fetchSuggestions();
    } catch (error) {
      console.error("Error rejecting suggestion:", error);
      toast.error("Error rejecting suggestion. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
    </>
  );
};

export default SuggestionModal;
