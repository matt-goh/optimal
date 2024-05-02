"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { linksData } from "../lib/linksData";
import Link from "next/link";
import "./styles.css";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {linksData.map((section, index) => (
        <React.Fragment key={index}>
          <div className="flex w-full text-left text-zinc-800 font-semibold text-m bg-transparent dark:text-zinc-200 mb-4">
            <span>{section.label}</span>
          </div>
          <div className="mb-4">
            {section.links.map((link) => (
              <Link
                key={link.label}
                href={link.link}
                passHref
                className={`flex py-[0.2rem] text-base font-normal relative ${
                  pathname === link.link
                    ? "text-teal-600 font-semibold dark:text-teal-500"
                    : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-400"
                } ${
                  link.subLabel ? "text-sm pointer-events-none mt-3 mb-2.5" : ""
                } my-1`}
              >
                <span className={`${link.subLabel ? "" : "mr-2"} items-center flex`}>
                  {link.icon}
                </span>
                <span
                  className={`${
                    link.subLabel
                      ? "border rounded-lg px-2 py-1 border-zinc-700"
                      : "pb-[0.10rem]"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </React.Fragment>
      ))}
    </>
  );
}
