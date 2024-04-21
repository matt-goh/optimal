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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(
      event.target.selectedOptions,
      (option) => option.value as TagType
    );
    setSelectedTags(value);
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                  {/* Tags Listbox */}
                  <Combobox
                    as="div"
                    value={selectedTags}
                    displayValue={(tags: TagType[]) => tags.join(", ")}
                    onChange={setSelectedTags}
                    multiple
                  >
                    <Combobox.Input
                      className="w-full py-2 px-3 rounded-md border border-gray-300"
                      placeholder="Select tags"
                    />
                    <Combobox.Options>
                      {tags.map((tag) => (
                        <Combobox.Option key={tag} value={tag}>
                          {({ active, selected }) => (
                            <div
                              className={`${
                                active
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-900"
                              } cursor-pointer select-none relative py-2 pl-10 pr-4`}
                            >
                              {tag}
                              {selected && (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3`}
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </Combobox>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Suggest a Resource
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
                  <div className="mt-4">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Cover photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        PhotoIcon
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
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
                        <Listbox.Button className="mt-1 relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                          {selectedResourceType}
                        </Listbox.Button>

                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {resourceTypes.map((type) => (
                              <Listbox.Option
                                key={type}
                                className={({ active }) =>
                                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-teal-100 text-teal-900"
                                      : "text-gray-900"
                                  }`
                                }
                                value={type}
                              >
                                {type}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </>
                    )}
                  </Listbox>
                  {/* Submit Button */}
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-md hover:bg-teal-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                    >
                      Submit Resource
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
