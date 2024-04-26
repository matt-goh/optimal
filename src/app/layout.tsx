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
          <div className="absolute z-20 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none"></div>
          <div className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75">
            <div className="max-w-8xl mx-auto">
              <div className="border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10 mx-4 lg:mx-0">
                  <Header />
              </div>
            </div>
          </div>
          <div className="">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
              <aside className="hidden lg:block fixed z-20 inset-0 top-[3.8125rem] left-[max(0px,calc(50%-45rem))] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto">
                <Sidebar />
              </aside>
              <div className="lg:pl-[19.5rem]">
                <main className="max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0 xl:mr-[15.5rem] xl:pr-16">
                  {children}
                  <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 overflow-y-auto hidden xl:block">
                    <div className="px-8">
                      <p className="">
                        Recent resources Lorem ipsum dolor, sit amet consectetur
                        adipisicing elit. Cupiditate cum quasi aut quibusdam,
                        tempora sapiente ipsam perferendis totam, tempore
                        inventore excepturi enim modi hic culpa quis, qui minima
                        possimus voluptas. Lorem ipsum dolor sit amet
                        consectetur adipisicing elit. Voluptatibus amet rem
                        commodi est sequi, officiis veniam impedit soluta, ab
                        sed enim, reiciendis voluptatem quo exercitationem.
                        Aspernatur esse laudantium saepe aut. Lorem ipsum dolor,
                        sit amet consectetur adipisicing elit. Excepturi
                        possimus quod neque commodi nobis asperiores ipsum
                        laborum earum perferendis porro id atque aliquid, ex
                        eum? Rem itaque quos nam tempore? Lorem ipsum, dolor sit
                        amet consectetur adipisicing elit. Quisquam vel amet
                        laboriosam molestias suscipit. Suscipit vero explicabo
                        consequuntur doloremque rem id eos, officiis similique
                        architecto, maxime eveniet magnam natus officia.
                      </p>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
