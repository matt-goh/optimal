import { SubmitModalProps, ResourceType, TagType } from "../types/types";
import { Dialog, Transition, Listbox, Combobox } from "@headlessui/react";
import React, { useState, Fragment } from "react";

const resourceTypes: ResourceType[] = [
  "Online Course",
  "Book",
  "Video",
  "Docs",
  "Website",
  "Other",
];
const tags: TagType[] = ["JavaScript", "Python", "TypeScript"];

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, setIsOpen }) => {
  const [selectedResourceType, setSelectedResourceType] =
    useState<ResourceType>(resourceTypes[0]);
  const [resourceImage, setResourceImage] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [resourceUrl, setResourceUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the input value is empty
    if (event.currentTarget.value === "") {
      // Check if the 'Backspace' key was pressed
      if (event.key === "Backspace" && selectedTags.length > 0) {
        // Prevent the default action to avoid navigation
        event.preventDefault();

        // Remove the last tag from the selectedTags array
        setSelectedTags(selectedTags.slice(0, -1));
      }
    } else {
      // Get the current input value
      const inputValue = event.currentTarget.value.trim();

      // Check if the 'Enter' key was pressed and the input is not empty
      if (event.key === "Enter" && inputValue) {
        // Prevent the default action to avoid form submission
        event.preventDefault();

        // Check if the inputValue is in the tags array and not already in the selectedTags
        if (
          tags.includes(inputValue as TagType) &&
          !selectedTags.includes(inputValue as TagType)
        ) {
          // Add the new tag to the selectedTags array
          setSelectedTags([...selectedTags, inputValue as TagType]);
        }

        // Clear the input field
        event.currentTarget.value = "";
      }
    }
  };

  const removeTag = (tagToRemove: TagType) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Process form data
    console.log({
      title,
      resourceUrl,
      selectedResourceType,
      selectedTags,
      resourceImage,
    });
    // Assuming you have a function to handle the actual submission logic
    // submitResource({ title, resourceUrl, selectedResourceType, selectedTag, resourceImage });
    setIsOpen(false); // Close the modal after form submission
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResourceImage(event.target.files[0]);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
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
                    <Combobox.Input
                      as="div"
                      className={`${
                        selectedTags.length > 0 ? "px-4" : "px-11"
                      } flex flex-wrap gap-2 py-2 border border-gray-300 rounded-md focus:ring focus:border-teal-500`}
                      displayValue={() => ""}
                    >
                      {selectedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 bg-teal-100 rounded-md px-3 py-1 text-teal-900 text-sm cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <button
                            type="button"
                            className="text-teal-600 hover:bg-teal-200 rounded-full flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#14b8a6"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
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
                      <input
                        type="text"
                        className={`${
                          selectedTags.length > 0 ? "w-auto" : "w-full"
                        } bg-transparent border-none focus:outline-none focus:border-teal-500`}
                        onKeyDown={handleInputKeyDown}
                        placeholder={"Select relevant topic(s)"}
                      />
                      {selectedTags.length === 0 && (
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
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
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
                      )}
                    </Combobox.Input>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Combobox.Options>
                        <div className="div border shadow rounded-md p-1 mt-1 focus:outline-none">
                          {tags.map((tag) => (
                            <Combobox.Option key={tag} value={tag}>
                              {({ active, selected }) => (
                                <div
                                  className={`${
                                    active
                                      ? "bg-teal-400 text-white"
                                      : "text-gray-900"
                                  } cursor-pointer select-none relative text-sm rounded-md m-0.5 py-2 pl-4 pr-4 focus:outline-none`}
                                >
                                  {tag}
                                  {selected && (
                                    <span
                                      className={`absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke={`${
                                          active ? "#fff" : "#2DD4BF"
                                        } `}
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
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
                          ))}
                        </div>
                      </Combobox.Options>
                    </Transition>
                  </Combobox>
                  <Dialog.Title
                    as="h3"
                    className="text-sm font-medium leading-6 text-gray-900"
                  >
                    Submit a Resource
                  </Dialog.Title>
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
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
                          <Listbox.Button className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-left cursor-default focus:border-teal-500">
                            <span className="block truncate">
                              {selectedResourceType}
                            </span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                              {/* Chevron icon or similar */}
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
                              className="absolute z-10 w-full py-1 mt-1 bg-white shadow-lg max-h-60 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                            >
                              {resourceTypes.map((type) => (
                                <Listbox.Option
                                  key={type}
                                  className={({ active }) =>
                                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                      active
                                        ? "text-teal-900 bg-teal-100"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={type}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
                                        }`}
                                      >
                                        {type}
                                      </span>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                                          {/* Check icon or similar */}
                                        </span>
                                      )}
                                    </>
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
                    <div className="mt-2 flex justify-center items-center rounded-md border border-dashed border-gray-900/25 px-6 py-9">
                      <div className="text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="42"
                          height="42"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#2dd4bf"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="icon inline icon-tabler icons-tabler-outline icon-tabler-photo"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M15 8h.01" />
                          <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
                          <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
                          <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
                        </svg>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 hover:text-teal-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-md hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
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
  );
};

export default SubmitModal;
