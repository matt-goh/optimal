import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition, Switch } from "@headlessui/react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ProfileDropdown = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, setUser } = useUser();
  const [profilePicUrl, setProfilePicUrl] = useState(
    "https://icwuwhijvlesjzisktiy.supabase.co/storage/v1/object/public/profile_images/default/default_o_cat.jpg"
  );

  useEffect(() => {
    // Check if dark mode is enabled in local storage on component mount
    const darkModeEnabled = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModeEnabled);
    updateHtmlClass(darkModeEnabled);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", String(!isDarkMode));
    updateHtmlClass(!isDarkMode);
  };

  const updateHtmlClass = (enableDark: boolean) => {
    const html = document.documentElement;
    enableDark ? html.classList.add("dark") : html.classList.remove("dark");
  };

  useEffect(() => {
    // Function to fetch the user's profile picture
    const fetchProfilePic = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("profile_pic_url")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile picture:", error);
        } else {
          setProfilePicUrl(data.profile_pic_url);
        }
      }
    };

    fetchProfilePic();
  }, [user]);
  const handleSignOut = async () => {
    // Sign out logic

    let { error } = await supabase.auth.signOut();
    if (error) console.error("Error logging out:", error.message);
    setUser(null);
    // Manually clear the local storage token to remove the user session
    localStorage.removeItem("supabase.auth.token");

    // Optionally, you can also refresh the page to ensure a clean state
    window.location.reload();
  };

  return (
    <Menu as="div" className="flex pt-0.5">
      <Menu.Button className="w-full text-sm font-semibold text-gray-900 hover:text-teal-500">
        <img
          src={profilePicUrl}
          alt="User"
          className="h-10 w-10 rounded-full shadow"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-4 z-10 mt-12 w-52 origin-top-right divide-y divide-zinc-100 dark:divide-zinc-700 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-zinc-800 dark:text-zinc-200">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? "bg-gray-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200"
                      : "",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <div className="flex items-center space-x-4 text-zinc-700 dark:text-zinc-200">
                    <img
                      src={profilePicUrl}
                      alt="User"
                      className="h-10 w-10 rounded-full shadow"
                    />
                    <span className="">View Profile</span>
                  </div>
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              <div className="px-4 py-3">
                <Switch.Group>
                  <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-200">
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-moon"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                      </svg>
                      <Switch.Label
                        className={"text-zinc-700 dark:text-zinc-200 text-sm"}
                      >
                        Dark Mode
                      </Switch.Label>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onChange={toggleDarkMode}
                      className={`${
                        isDarkMode ? "bg-teal-600" : "bg-gray-200"
                      } relative inline-flex h-[28px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          isDarkMode ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white dark:bg-zinc-300 shadow-lg ring-0 `}
                      />
                    </Switch>
                  </div>
                </Switch.Group>
              </div>
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active
                      ? "bg-gray-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200"
                      : "",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-settings"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
                      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                    </svg>
                    <span className="">Settings</span>
                  </div>
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={handleSignOut}
                  className={classNames(
                    active
                      ? "bg-gray-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200"
                      : "",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                >
                  <div className="flex items-center ml-[0.2rem] space-x-2 text-zinc-700 dark:text-zinc-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                      <path d="M9 12h12l-3 -3" />
                      <path d="M18 15l3 -3" />
                    </svg>
                    <span className="">Log out</span>
                  </div>
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileDropdown;
