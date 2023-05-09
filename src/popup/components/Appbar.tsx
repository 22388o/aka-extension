import React from "react";
import { Form, useSubmit, useRouteLoaderData } from "react-router-dom";
import { KeyPair } from "../../common/model/KeyPair";

function AppBar({ onKeyChange }) {
  const keypairs = useRouteLoaderData("root") as KeyPair[];

  const curProfile = keypairs.find((profile) => profile.isCurrent);
  let otherProfiles = keypairs.filter((profile) => !profile.isCurrent);
  console.log(`Other Profiles ${JSON.stringify({ otherProfiles })}`);
  let hideDropdown = false;

  const profileButtonClick = () => {
    const dropdown = document.querySelector("#optionDropdown");
    dropdown.classList.toggle("hidden");
  };

  // on dropdown select, send selected dropdown pubkey to root action
  const profileItemClick = (e: React.MouseEvent<HTMLElement>) => {
    // hidden input field
    const hiddenInput = document.querySelector("#optionSelectedPubkey") as any;
    hiddenInput.value = e.currentTarget.id;

    // hide dropdown
    const dropdown = document.querySelector("#optionDropdown");
    dropdown.classList.toggle("hidden");

    const form = document.querySelector("#optionProfileForm") as any;
    onKeyChange(hiddenInput.value);

    submit(form);
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    // hide dropdown
    const dropdown = document.querySelector("#optionDropdown");
    dropdown.classList.add("hidden");
  };

  let submit = useSubmit();
  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm">
      <div className="max-w-6xl mx-auto h-10 px-4 py-2">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div className="flex items-center h-8">
              <span className="text-slate-900 dark:text-white font-semibold text-lg">
                Options
              </span>
            </div>
          </div>
          <div className={`py-[0.1rem] ${hideDropdown ? "hidden" : ""}`}>
            {/* TODO: add dark:hover:bg-???? to button */}
            <button
              id="profileButton"
              data-dropdown-toggle="dropdown"
              className="h-5 w-40 bg-gray-100 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  text-center inline-flex items-center"
              type="button"
              onClick={profileButtonClick}
            >
              <div id="profileButtonText" className="flex-1">
                {curProfile && curProfile.name + " "}
              </div>
              <svg
                className="w-4 h-4 ml-2 mr-1"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {/* <!-- Dropdown menu --> */}
            <Form id="optionProfileForm" action="/options" method="post">
              <input
                type="hidden"
                id="optionSelectedPubkey"
                name="selectedPubkey"
                value="test"
              />
              <div
                id="optionDropdown"
                onMouseLeave={onMouseLeave}
                className="w-40 hidden bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  {otherProfiles.map((profile) => (
                    <li key={profile.public_key}>
                      <div
                        id={profile.public_key}
                        onClick={profileItemClick}
                        className="block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        {profile.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppBar;
