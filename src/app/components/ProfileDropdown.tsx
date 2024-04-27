import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ProfileDropdown = () => {
  const { setUser } = useUser();

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
    <Menu as="div" className="relative">
      <Menu.Button className="w-full text-sm font-semibold text-gray-900 hover:text-teal-500 p-2 mt-[0.1rem]">
        Profile
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ">
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
