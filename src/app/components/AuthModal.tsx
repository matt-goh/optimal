
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { AuthModalProps } from "../types/types";
import { useUser } from "../context/UserContext";

const AuthModal: React.FC<AuthModalProps> = ({ opened, setOpened }) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { signInWithGoogle } = useUser();

  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <Transition.Root show={opened} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={setOpened}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full relative">
              <button
                type="button"
                className="absolute top-0 right-0 m-2 text-gray-400 bg-white rounded-md text-sm p-2 hover:text-gray-500 focus:outline-none"
                onClick={() => setOpened(false)}
              >
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
                  className="icon icon-tabler icons-tabler-outline icon-tabler-x"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
              <div className="bg-white m-8 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3
                      className="text-2xl leading-6 font-bold text-gray-900 text-center"
                      id="modal-title"
                    >
                      {isLogin ? "Welcome back" : "Create an account"}
                    </h3>
                    <div className="mt-6">
                      <button
                        className="flex gap-2 justify-center items-center w-full leading-normal py-2 px-4 shadow-sm border border-gray-300 text-white rounded-md hover:bg-gray-100 focus:outline-none"
                        onClick={signInWithGoogle}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 90 92"
                          fill="none"
                          className="h-[18px] w-[18px]"
                        >
                          <path
                            d="M90 47.1c0-3.1-.3-6.3-.8-9.3H45.9v17.7h24.8c-1 5.7-4.3 10.7-9.2 13.9l14.8 11.5C85 72.8 90 61 90 47.1z"
                            fill="#4280ef"
                          ></path>
                          <path
                            d="M45.9 91.9c12.4 0 22.8-4.1 30.4-11.1L61.5 69.4c-4.1 2.8-9.4 4.4-15.6 4.4-12 0-22.1-8.1-25.8-18.9L4.9 66.6c7.8 15.5 23.6 25.3 41 25.3z"
                            fill="#34a353"
                          ></path>
                          <path
                            d="M20.1 54.8c-1.9-5.7-1.9-11.9 0-17.6L4.9 25.4c-6.5 13-6.5 28.3 0 41.2l15.2-11.8z"
                            fill="#f6b704"
                          ></path>
                          <path
                            d="M45.9 18.3c6.5-.1 12.9 2.4 17.6 6.9L76.6 12C68.3 4.2 57.3 0 45.9.1c-17.4 0-33.2 9.8-41 25.3l15.2 11.8c3.7-10.9 13.8-18.9 25.8-18.9z"
                            fill="#e54335"
                          ></path>
                        </svg>
                        <span className="block font-medium text-gray-900">
                          Continue with Google
                        </span>
                      </button>
                      <button
                        className="flex gap-2 mt-3 justify-center items-center w-full leading-normal py-2 px-4 shadow-sm border border-gray-300 text-white rounded-md hover:bg-gray-100 focus:outline-none"
                        // Add your signInWithProvider logic here
                      >
                        <svg
                          className="h-[18px] w-[18px]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 98 96"
                        >
                          <path
                            d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362l-.08-9.127c-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126l-.08 13.526c0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                            fill="#24292f"
                          ></path>
                        </svg>
                        <span className="block font-medium text-gray-900">
                          Continue with GitHub
                        </span>
                      </button>
                      <div className="flex w-full items-center gap-2 py-4 text-sm text-gray-700">
                        <div className="h-px w-full bg-gray-300"></div>or
                        <div className="h-px w-full bg-gray-300"></div>
                      </div>
                      {isLogin ? (
                        <>
                          <input
                            type="text"
                            placeholder="Email or username"
                            required
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                          />
                          <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500 mt-3"
                          />
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            placeholder="Email"
                            required
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                          />
                          <input
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500 mt-3"
                          />
                          <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500 mt-3"
                          />
                        </>
                      )}
                      <div className="mt-5 flex items-center">
                        <div className="text-sm">
                          {isLogin ? (
                            <>
                              <span>Don't have an account? </span>
                              <a
                                onClick={toggleAuthMode}
                                className="cursor-pointer text-teal-600 hover:text-teal-700"
                              >
                                Sign Up
                              </a>
                            </>
                          ) : (
                            <>
                              <span>Already have an account? </span>
                              <a
                                onClick={toggleAuthMode}
                                className="cursor-pointer text-teal-600 hover:text-teal-700"
                              >
                                Log In
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-5 flex justify-center items-center">
                        <button
                          onClick={() => {}}
                          className="inline-flex items-center w-full justify-center py-3 border border-transparent text-base font-medium rounded-full text-white bg-teal-500 hover:bg-teal-600"
                        >
                          {isLogin ? "Log in" : "Continue"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AuthModal;
