"use client";

import { SubmitModalProps, ResourceType, TagType } from "../types/types";
import { Dialog, Transition, Listbox, Combobox } from "@headlessui/react";
import React, { useState, Fragment, useEffect, useRef } from "react";
import { ToastContainer, Zoom, toast } from "react-toastify";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";
import "react-toastify/dist/ReactToastify.css";

const resourceTypes: ResourceType[] = [
  "Online Course",
  "YouTube Tutorial",
  "Book",
  "Docs",
  "Interactive website",
  "Other",
];

const tags: TagType[] = [
  "JavaScript",
  "Python",
  "Java",
  "HTML/CSS",
  "TypeScript",
];

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, setIsOpen }) => {
  const [selectedResourceType, setSelectedResourceType] =
    useState<ResourceType>(resourceTypes[0]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [resourceImage, setResourceImage] = useState<File | null>(null);
  const [tagsContainerHeight, setTagsContainerHeight] = useState(0);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [resourceUrl, setResourceUrl] = useState("");
  const [dragCounter, setDragCounter] = useState(0);
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const { user } = useUser();

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the input value is empty and if 'Backspace' key was pressed
    if (event.key === "Backspace" && selectedTags.length > 0) {
      event.preventDefault(); // Prevent the default action to avoid navigation
      setSelectedTags(selectedTags.slice(0, -1)); // Remove the last tag from the selectedTags array
    }
  };

  const filteredTags =
    query === ""
      ? tags
      : tags.filter((tag) =>
          tag.toLowerCase().trim().includes(query.toLowerCase().trim())
        );

  const removeTag = (tagToRemove: TagType) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    if (tagsContainerRef.current) {
      setTagsContainerHeight(tagsContainerRef.current.offsetHeight);
    }
  }, [selectedTags]); // Depend on selectedTags so it recalculates when tags change

  // Conditional class based on height
  const extraMarginClass =
    tagsContainerHeight > 120
      ? "mt-24 pt-4"
      : tagsContainerHeight > 50
      ? "mt-16"
      : "mt-4";

  const extraMarginClassOptions =
    tagsContainerHeight > 120
      ? "mt-24"
      : tagsContainerHeight > 50
      ? "mt-14"
      : "mt-2";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Custom validation for tags
      if (selectedTags.length === 0) {
        alert("Please select at least one tag.");
        return;
      }

      const imageUrl = await uploadImage(resourceImage);

      const payload = {
        title: title,
        resource_url: resourceUrl,
        resource_type: selectedResourceType,
        tags: selectedTags,
        image_url: imageUrl,
        user_id: user?.id,
      };

      // Send the payload to your Supabase table
      const { data, error } = await supabase
        .from("resources") // Replace with your actual table name
        .insert([payload]);

      if (error) throw error;

      toast.success("Resource submitted for review!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });

      setIsOpen(false); // Close the modal after successful submission
      setSelectedResourceType(resourceTypes[0]);
      setImagePreviewUrl(null);
      setResourceImage(null);
      setSelectedTags([]);
      setResourceUrl("");
      setTitle("");
      setQuery("");
    } catch (error) {
      // Handle any errors
      console.error("Error submitting:", error);
      toast.error("Failed to submit suggestion. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File | null) => {
    if (file && user) {
      let filePath = `${user.user_metadata.full_name}/${file.name}`;

      let { data, error } = await supabase.storage
        .from("resource_image")
        .upload(filePath, file);
      if (error) {
        console.error("Upload Error:", error.message);
        throw new Error(error.message);
      }

      // Return the URL of the uploaded file
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resource_image/${data?.path}`;
    } else {
      console.log("No file or user information provided");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow the drop
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = event.dataTransfer.files[0];
    if (files) {
      if (!files.type.match("image.*")) {
        alert("Only image files are allowed!");
        return;
      }
      handleImageChange(files);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      // If the related target is a child, don't change the state
      return;
    }
    setDragCounter((prev) => prev + 1);
    if (dragCounter === 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      // If the related target is still within the parent, don't change the state
      return;
    }
    setDragCounter((prev) => prev - 1);
    if (dragCounter === 1) {
      setIsDragOver(false);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (!file.type.match("image.*")) {
        alert("Only image files are allowed!");
        return;
      }
      handleImageChange(file);
    }
  };

  const handleImageChange = (file: File) => {
    if (file) {
      setResourceImage(file);

      // Create a URL for the file to be used as a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreviewUrl(null);
    setResourceImage(null);
  };

  return (
    <>
      <ToastContainer />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                    {/* Tags Listbox */}
                    <Combobox
                      as="div"
                      value={selectedTags}
                      onChange={setSelectedTags}
                      multiple
                    >
                      {({ open }: { open: boolean }) => (
                        <>
                          <Combobox.Input
                            as="input"
                            className={`${
                              selectedTags.length >= 3
                                ? "w-full pl-4 border-none caret-transparent text-transparent"
                                : selectedTags.length > 0
                                ? "pl-4 border-none caret-transparent text-transparent"
                                : "pl-11 border border-gray-300 caret-teal-500"
                            } text-teal-500 flex flex-wrap gap-2 py-2 rounded-md focus:outline-none focus:border-teal-500`}
                            placeholder={
                              selectedTags.length > 0
                                ? ""
                                : "Select relevant topic(s)"
                            }
                            value={`${selectedTags.length > 0 ? "" : query}`}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                          />

                          <div
                            ref={tagsContainerRef}
                            className="absolute left-6 top-9 flex flex-wrap gap-2"
                          >
                            {selectedTags.map((tag, index) => (
                              <span
                                key={index}
                                className="flex items-center gap-1 border border-teal-500 rounded-lg px-4 py-2 text-teal-500 font-semibold text-sm cursor-pointer"
                                onClick={() => removeTag(tag)}
                              >
                                {tag}
                                <button
                                  type="button"
                                  className="rounded-full flex items-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#14B8A6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="icon icon-tabler icons-tabler-outline icon-tabler-xbox-x"
                                  >
                                    <path
                                      stroke="none"
                                      d="M0 0h24v24H0z"
                                      fill="none"
                                    />
                                    <path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z" />
                                    <path d="M9 8l6 8" />
                                    <path d="M15 8l-6 8" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>

                          {selectedTags.length === 0 && (
                            <>
                              <Combobox.Button
                                className="absolute flex items-center"
                                style={{ top: "2.7rem", right: "14.5rem" }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#9CA3AE"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="icon icon-tabler icons-tabler-outline icon-tabler-selector"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M8 9l4 -4l4 4" />
                                  <path d="M16 15l-4 4l-4 -4" />
                                </svg>
                              </Combobox.Button>
                              <div
                                className="absolute left-0 flex pl-9 pointer-events-none"
                                style={{ top: "2.63rem" }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#9CA3AE"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
                                  <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
                                  <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
                                  <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
                                  <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
                                  <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
                                  <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
                                  <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
                                </svg>
                              </div>
                            </>
                          )}

                          <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <Combobox.Options static>
                              <div
                                className={`div border shadow-lg rounded-lg p-1 focus:outline-none ${
                                  open ? extraMarginClassOptions : ""
                                }`}
                              >
                                {filteredTags.length === 0 && query !== "" ? (
                                  <div className="relative cursor-default select-none px-4 py-2 text-sm text-gray-700">
                                    Nothing found.
                                  </div>
                                ) : (
                                  filteredTags.map((tag) => (
                                    <Combobox.Option key={tag} value={tag}>
                                      {({ active, selected }) => (
                                        <div
                                          className={`${
                                            active
                                              ? "bg-teal-500 text-white"
                                              : "text-gray-900"
                                          } cursor-pointer select-none relative text-sm rounded m-0.5 py-2 pl-4 pr-4 focus:outline-none`}
                                        >
                                          {tag}
                                          {selected && (
                                            <span className="absolute inset-y-0 right-3 flex items-center pl-3 text-teal-600">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke={`${
                                                  active ? "#fff" : "#14B8A6"
                                                } `}
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="icon icon-tabler icons-tabler-outline icon-tabler-check"
                                              >
                                                <path
                                                  stroke="none"
                                                  d="M0 0h24v24H0z"
                                                  fill="none"
                                                />
                                                <path d="M5 12l5 5l10 -10" />
                                              </svg>
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </Combobox.Option>
                                  ))
                                )}
                              </div>
                            </Combobox.Options>
                          </Transition>
                          <Dialog.Title
                            as="h3"
                            className={`text-sm font-medium leading-6 text-gray-900 ${
                              open ? "mt-4" : extraMarginClass
                            }`}
                          >
                            Submit a Resource
                          </Dialog.Title>
                        </>
                      )}
                    </Combobox>
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Resource URL"
                        value={resourceUrl}
                        onChange={(e) => setResourceUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    {/* Resource Type Listbox */}
                    <Listbox
                      value={selectedResourceType}
                      onChange={setSelectedResourceType}
                    >
                      {({ open }) => (
                        <>
                          <Listbox.Label className="block text-sm font-medium text-gray-700">
                            Resource Type
                          </Listbox.Label>
                          <div className="mt-1 relative">
                            <Listbox.Button className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:border-teal-500">
                              <span className="block truncate">
                                {selectedResourceType}
                              </span>
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#9CA3AE"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="icon icon-tabler icons-tabler-outline icon-tabler-selector"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <path d="M8 9l4 -4l4 4" />
                                  <path d="M16 15l-4 4l-4 -4" />
                                </svg>
                              </span>
                            </Listbox.Button>
                            <Transition
                              show={open}
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options
                                static
                                className="absolute z-10 w-full p-1 mt-1 bg-white shadow-lg max-h-60 rounded-lg text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                              >
                                {resourceTypes.map((type) => (
                                  <Listbox.Option key={type} value={type}>
                                    {({ active, selected }) => (
                                      <div
                                        className={`cursor-pointer text-sm rounded m-0.5 select-none relative py-2 pl-4 pr-4 focus:outline-none 
                                      ${selected ? "font-semibold" : ""}
                                      ${
                                        active
                                          ? "bg-teal-500 text-white"
                                          : "text-gray-900"
                                      }`}
                                      >
                                        {type}
                                        {selected && (
                                          <span className="absolute inset-y-0 right-3 flex items-center pl-3 text-teal-600">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="24"
                                              height="24"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke={`${
                                                active ? "#fff" : "#14B8A6"
                                              } `}
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              className="icon icon-tabler icons-tabler-outline icon-tabler-check"
                                            >
                                              <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                              />
                                              <path d="M5 12l5 5l10 -10" />
                                            </svg>
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </>
                      )}
                    </Listbox>
                    <div className="mt-4">
                      <label
                        htmlFor="cover-photo"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Cover photo
                      </label>
                      {imagePreviewUrl ? (
                        <div className="relative mt-2">
                          <img
                            src={imagePreviewUrl}
                            alt="Preview"
                            className="mx-auto h-full w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            className="absolute bg-slate-100/5 text-red-400 hover:text-red-500 top-2 right-2 p-1 rounded-lg"
                            onClick={clearImage}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="icon icon-tabler icons-tabler-filled icon-tabler-trash-x"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" />
                              <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`mt-2 flex justify-center items-center rounded-md border  ${
                            isDragOver
                              ? "border-teal-500"
                              : "border-gray-900/25 border-dashed"
                          } px-6 py-8`}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                        >
                          <div className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#2dd4bf"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="icon inline icon-tabler icons-tabler-outline icon-tabler-photo"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M15 8h.01" />
                              <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
                              <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
                              <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
                            </svg>
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 hover:text-teal-600"
                              >
                                <span>Upload a photo</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileInputChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Submit Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-end justify-center px-6 py-2 text-base font-semibold text-white bg-teal-500 border border-transparent rounded-full hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SubmitModal;
