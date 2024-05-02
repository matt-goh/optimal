import { UserProvider } from "./context/UserContext";
import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import React from "react";
import "./components/styles.css";
import BookmarkedSidebar from "./components/BookmarkedSidebar";

export const metadata: Metadata = {
  title: "Optimal",
  description: "Optimal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased dark:text-zinc-200 bg-white dark:bg-zinc-900/95 transition-colors duration-500">
        <UserProvider>
          <div className="z-0 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none"></div>
          <div className="sticky top-0 z-50 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-zinc-900/10 dark:border-zinc-50/[0.06] bg-white/50 supports-backdrop-blur:bg-white/95 dark:bg-zinc-900/50">
            <div className="max-w-[90rem] mx-auto">
              <div className="border-b border-gray-900/10 lg:px-8 lg:border-0 dark:border-gray-300/10 mx-4 lg:mx-0">
                <div className="relative flex items-center py-[0.6rem]">
                  <Header />
                </div>
              </div>
            </div>
          </div>
          <>
            <div className="max-w-8xl mx-auto px-0 sm:px-6 md:px-8">
              <aside className="hidden lg:block fixed z-0 inset-0 top-[3.8125rem] mt-10 left-[max(0px,calc(50%-45rem))] right-auto w-[17rem] pb-10 pl-8 pr-6 overflow-y-auto">
                <Sidebar />
              </aside>
              <main className="relative mx-auto mt-10 xl:max-w-3xl 2xl:max-w-4xl md:left-[max(0px,calc(50%-20rem)) lg:left-[max(0px,calc(50%-14rem))] xl:left-[max(0px,calc(50%-60rem))] 2xl:left-[3rem] w-dvh h-dvh ">
                <div className="z-20 sm:w-[38rem] md:w-[40rem] xl:w-[45rem] 2xl:w-[50rem] pr-4 overflow-y-auto">
                  {children}
                </div>
                <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-50rem))] lg:w-[19.5rem] 2xl:w-[24rem] py-10 overflow-y-auto hidden xl:block">
                  <BookmarkedSidebar />
                </div>
              </main>
            </div>
          </>
        </UserProvider>
      </body>
    </html>
  );
}
