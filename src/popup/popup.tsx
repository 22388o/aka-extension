import React from "react";
import { Form, useActionData, redirect } from "react-router-dom";
import { nip19 } from "nostr-tools";

import Splash from "./components/Splash";
import Panel from "./components/Panel";
import InputButton from "./components/InputButton";

const Popup = () => {
  const errors = useActionData() as { privateKey: "" };

  return (
    <div className="flex flex-col items-center flex-1 p-3 w-auto gap-4">
      <Panel>
        <h1 className="font-semibold text-lg text-aka-blue">Welcome!</h1>
        <p className="text-slate-500 dark:text-slate-400">
          <span className="font-semibold">AKA Profiles</span> allows to you
          connect to apps without revealing your real identity.
        </p>
      </Panel>
      <div className=" w-full rounded-lg shadow-xl bg-aka-yellow p-3">
        <Splash className="mx-auto  h-44 w-44 fill-aka-blue" />
      </div>

      <Panel>
        <div className="flex flex-col items-center flex-1 p-2 w-auto gap-1">
          <Form id="loginForm" method="post" className="w-full">
            <div className="text-black">
              <input
                type="text"
                id="privateKey"
                name="privateKey"
                autoFocus
                className="w-full bg-gray-100 dark:bg-slate-900 text-slate-900 dark:text-white p-2 placeholder:italic placeholder:text-slate-400 border border-slate-300"
                placeholder="private key (nsec or hex)"
              />
              <div className="h-4 text-red-500">
                {errors?.privateKey && <span>{errors.privateKey}</span>}
              </div>
            </div>

            <div className="pt-4">
              <div className="mx-auto w-[4.5rem]">
                <InputButton>Login</InputButton>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-center text-slate-500 dark:text-slate-400">
                Don't have a profile yet? Try{" "}
                <a
                  className="font-semibold text-blue-900 dark:text-blue-200"
                  href="https://nosta.me"
                  target="_blank"
                >
                  nostra.me!
                </a>
              </p>
            </div>
          </Form>
        </div>
      </Panel>
    </div>
  );
};

export default Popup;

export async function action({ request }) {
  const formData = await request.formData();
  const privateKey = formData.get("privateKey");
  const errors = { privateKey: "" };

  // validate the fields
  if (!isKeyValid(privateKey)) {
    errors.privateKey = "not a valid private key";
    return errors;
  }

  // otherwise save the profile and redirect
  // await createUser(email, password);
  return redirect("/badge");
}

function isKeyValid(key: string) {
  if (key.match(/^[a-f0-9]{64}$/)) return true;
  try {
    if (nip19.decode(key).type === "nsec") return true;
  } catch (_) {}
  return false;
}
