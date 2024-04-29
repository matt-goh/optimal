import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ProfileDropdown = () => {
  const { user, setUser } = useUser();
  const [profilePicUrl, setProfilePicUrl] = useState(
    "https://icwuwhijvlesjzisktiy.supabase.co/storage/v1/object/public/profile_images/default/default_o_cat.jpg"
  );

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
          className="h-10 w-10 rounded-full shadow" // You can adjust the size as needed
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
        <Menu.Items className="absolute right-4 z-10 mt-12 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  View Profile
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Dark Mode
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
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
                    active
                      ? "bg-gray-100 text-gray-900 cursor-pointer"
                      : "text-gray-700",
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
