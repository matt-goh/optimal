import { UserProvider } from "./context/UserContext";
import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import React from "react";
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
          <Header />
          <div className="flex justify-center overflow-hidden w-full">
            <div className="flex w-3/5">
              <aside className="w-1/5">
                <Sidebar />
              </aside>
              <main className="flex w-3/5">{children}</main>
              <div className="flex w-1/4 p-4">
                <p className="">
                  Recent resources Lorem ipsum dolor, sit amet consectetur
                  adipisicing elit. Cupiditate cum quasi aut quibusdam, tempora
                  sapiente ipsam perferendis totam, tempore inventore excepturi
                  enim modi hic culpa quis, qui minima possimus voluptas. Lorem
                  ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatibus amet rem commodi est sequi, officiis veniam
                  impedit soluta, ab sed enim, reiciendis voluptatem quo
                  exercitationem. Aspernatur esse laudantium saepe aut. Lorem
                  ipsum dolor, sit amet consectetur adipisicing elit. Excepturi
                  possimus quod neque commodi nobis asperiores ipsum laborum
                  earum perferendis porro id atque aliquid, ex eum? Rem itaque
                  quos nam tempore? Lorem ipsum, dolor sit amet consectetur
                  adipisicing elit. Quisquam vel amet laboriosam molestias
                  suscipit. Suscipit vero explicabo consequuntur doloremque rem
                  id eos, officiis similique architecto, maxime eveniet magnam
                  natus officia.
                </p>
              </div>
            </div>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
