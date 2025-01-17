import React from "react";
import { useLoaderData, Form, redirect } from "react-router-dom";
import browser from "webextension-polyfill";

export function Test() {
  const name: any = useLoaderData();
  console.log("Test Render: " + JSON.stringify(name));
  // document.documentElement.classList.add("dark");

  return (
    <>
      {/* Canvas */}
      <div className=" bg-gray-100 dark:bg-slate-900 flex flex-col items-center h-80 pt-4">
        {/* Panel */}
        <div className="bg-white dark:bg-slate-800 w-60 mx-auto rounded-lg px-6 py-6 ring-1 ring-slate-900/5 shadow-xl">
          {/* Title */}
          <h1 className="text-slate-900 dark:text-white text-lg">
            Name: {name}
          </h1>
          {/* Text */}
          <p className="text-slate-500 dark:text-slate-400">
            Test component saving name into local storage and supporting dark
            mode.
          </p>
          <Form method="post" className="pt-2">
            <input
              type="text"
              id="name"
              name="name"
              className=" border-2 border-black"
            />
            <br />
            <br />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}

export const loader = async (): Promise<string> => {
  const data = await browser.storage.local.get("test");
  console.log("test loader called: " + JSON.stringify(data));
  if (!data || !data.test || !data.test.name) return "<not set>";
  return data.test.name;
};

export async function action({ request, params }) {
  let formData = await request.formData();
  const data = Object.fromEntries(formData);
  console.log("test action called: " + JSON.stringify(data));
  const name = data.name;

  browser.storage.local.set({ test: { name: name } });
  return redirect("/test");
}

export default Test;
