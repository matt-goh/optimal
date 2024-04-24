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
    </>
  );
}
