"use client";

import React from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  return (
    <>
      {linksData.map((section, index) => (
        <React.Fragment key={index}>
          <div className="flex w-full text-left py-2.5 mt-6 text-zinc-800 font-semibold text-m bg-transparent dark:text-zinc-200">
            <span>{section.label}</span>
          </div>
          {section.links.map((link) => (
            <Link
              key={link.label}
              href={link.link}
              passHref
              className={`block pl-9 pr-4 py-0.5 text-base font-normal relative ${
                pathname === link.link
                  ? "text-zinc-600 font-semibold dark:text-teal-500"
                  : "text-zinc-600 hover:border-gray-400 dark:text-zinc-500"
              } border-l border-gray-100 focus:border-zinc-600 my-1`}
            >
              {link.label}
            </Link>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}
