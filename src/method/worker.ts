import { parentPort, workerData } from "node:worker_threads";
import { replaceData } from "../utils/public";
import { IRequestQueueData } from "./execute";

const data = <IRequestQueueData>workerData;

data.urls = data.urls.map((val) => {
  return replaceData(val, data.params);
});

// Execute webhook request
Promise.allSettled(data.urls.map((val) => fetch(val)))
  .then(async (val) => {
    // Format Data
    let saveData = val.map(async (val, index) => {
      const key = data.urls[index];
      const text =
        val.status === "fulfilled" ? await val.value.json() : "rejected";
      return { key, status: val.status, res: text };
    });
    const result = await Promise.all(saveData);
    // Post result to main thread
    parentPort?.postMessage(result);
  })
  .catch((err) => {
    // Report error
    parentPort?.postMessage(err.toString());
  });
