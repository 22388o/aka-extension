import browser from "webextension-polyfill";
import React, { useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import Alert from "../../common/components/Alert";
export type Relay = Record<string, { read: boolean; write: boolean }>;

function Relays() {
  // const relays = useRouteLoaderData("options") as Relay[];

  const [relays, setRelays] = useState([]);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert(false);
    }, 5000);

    // To clear or cancel a timer, you call the clearTimeout(); method,
    // passing in the timer object that you created into clearTimeout().

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    browser.storage.local.get(["relays"]).then((results) => {
      if (results.relays) {
        let relaysList = [];
        for (let url in results.relays) {
          relaysList.push({
            url,
            policy: results.relays[url],
          });
        }
        setRelays(relaysList);
      }
    });
  }, []);

  return (
    <>
      <div className="flex flex-col space-y-1">
        {relays.map(({ url, policy }, i) => (
          <div key={i} className="flex flex-row content-center space-x-1">
            <input
              style={{ marginRight: "10px", width: "400px" }}
              value={url}
              className="h-6 bg-gray-100 dark:bg-slate-900 text-slate-900 dark:text-white px-2 placeholder:italic placeholder:text-slate-400 border border-slate-300"
              onChange={changeRelayURL.bind(null, i)}
              onBlur={deleteRelay.bind(null, i)}
            />
            <label htmlFor={`read${i}`} className="pt-0.5">
              read
            </label>
            <input
              id={`read${i}`}
              type="checkbox"
              checked={policy.read}
              onChange={toggleRelayPolicy.bind(null, i, "read")}
            />

            <label htmlFor={`write${i}`} className="pt-0.5 pl-1">
              write
            </label>
            <input
              id={`write${i}`}
              type="checkbox"
              checked={policy.write}
              onChange={toggleRelayPolicy.bind(null, i, "write")}
            />
          </div>
        ))}
      </div>
      <button
        onClick={(e) => {
          addNewRelay();
        }}
        className="bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-1 px-2"
      >
        add new...
      </button>
      <div className="flex flex-col justify-center pt-1">
        <button
          className="mx-auto w-20 bg-aka-blue hover:bg-blue text-white font-bold py-1 px-4 rounded"
          onClick={(e) => {
            saveRelays();
          }}
        >
          <p className="tracking-widest">Save</p>
        </button>
        <div className="mx-auto w-40 pt-2">
          {alert && <Alert>{message}</Alert>}
        </div>
      </div>
    </>
  );

  function changeRelayURL(i, ev) {
    setRelays([
      ...relays.slice(0, i),
      { url: ev.target.value, policy: relays[i].policy },
      ...relays.slice(i + 1),
    ]);
  }

  function deleteRelay(i, ev) {
    if (relays[i].url == "") {
      const newArr = [...relays.slice(0, i), ...relays.slice(i + 1)];
      setRelays(newArr);
    }
  }

  function toggleRelayPolicy(i, cat) {
    setRelays([
      ...relays.slice(0, i),
      {
        url: relays[i].url,
        policy: { ...relays[i].policy, [cat]: !relays[i].policy[cat] },
      },
      ...relays.slice(i + 1),
    ]);
  }

  function addNewRelay() {
    const newArr = [...relays];

    newArr.push({
      url: "",
      policy: { read: true, write: true },
    });
    setRelays(newArr);
  }

  async function saveRelays() {
    await browser.storage.local.set({
      relays: Object.fromEntries(
        relays
          .filter(({ url }) => url.trim() !== "")
          .map(({ url, policy }) => [url.trim(), policy])
      ),
    });
    setAlert(true);
    setMessage("saved");
  }
}

export default Relays;