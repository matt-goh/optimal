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
        <Menu.Items className="absolute right-4 z-10 mt-12 w-44 origin-top-right divide-y divide-zinc-100 dark:divide-zinc-700 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-zinc-800 dark:text-zinc-200">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200" : "",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  View Profile
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              <div className="px-4 py-3">
                <Switch.Group>
                  <div className="flex items-center justify-between">
                    <Switch.Label
                      className={"text-zinc-700 dark:text-zinc-200 text-sm"}
                    >
                      Dark Mode
                    </Switch.Label>
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
                    active ? "bg-gray-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200" : "",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Settings
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
                    active ? "bg-gray-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-200" : "",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Log out
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
