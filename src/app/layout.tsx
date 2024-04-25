import { MantineProvider } from "@mantine/core";
import { UserProvider } from "./context/UserContext";
import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import React from "react";
import "@mantine/core/styles.css";
import "./components/styles.css";

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
    <html lang="en">
      <body>
        <UserProvider>
          <MantineProvider theme={{}} defaultColorScheme="light">
            <Header />
            <div className="flex justify-center overflow-hidden w-full">
              <div className="flex w-3/5">
                <aside className="w-1/5">
                  <Sidebar />
                </aside>
                <main className="flex w-3/5">{children}</main>
              </div>
            </div>
          </MantineProvider>
        </UserProvider>
      </body>
    </html>
  );
}
