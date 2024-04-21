"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SubmitModal from "./SubmitModal";
import Link from "next/link";
import "./styles.css";

const linksData = [
  {
    label: "Programming Languages",
    links: [
      { label: "JavaScript", link: "/javascript" },
      { label: "Python", link: "/python" },
      { label: "Java", link: "/java" },
    ],
  },
  {
    label: "Web Development",
    links: [
      { label: "HTML/CSS", link: "/html-css" },
      { label: "JavaScript", link: "/javascript" },
      { label: "TypeScript", link: "/typescript" },
    ],
  },
];

export default function Sidebar() {
  const [isModalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();

  const openSubmitModal = () => {
    setModalOpen(true); // Open the modal

    // Push the new state to history
    window.history.pushState({ modalOpened: true }, "", `/submit`);

    // Handle the back button when the modal is open
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.modalOpened) {
        setModalOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  };

  return (
    <>
      {linksData.map((section, index) => (
        <React.Fragment key={index}>
          <div className="flex w-full text-left py-2.5 text-gray-800 font-semibold text-m bg-transparent">
            <span>{section.label}</span>
          </div>
          {section.links.map((link) => (
            <Link
              key={link.label}
              href={link.link}
              passHref
              className={`block pl-9 pr-4 py-0.5 text-m font-normal relative ${
                pathname === link.link
                  ? "text-teal-600 font-semibold"
                  : "text-gray-600 hover:border-gray-400"
              } border-l border-gray-100 focus:border-teal-600 my-1`}
            >
              {link.label}
            </Link>
          ))}
        </React.Fragment>
      ))}
      <button
        onClick={openSubmitModal}
        className="px-4 py-2 text-left text-sm text-gray-800 bg-teal-500 hover:bg-teal-600 rounded-md shadow"
      >
        Submit a Resource
      </button>
      <SubmitModal isOpen={isModalOpen} setIsOpen={setModalOpen} />
    </>
  );
}
