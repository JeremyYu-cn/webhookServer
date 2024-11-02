import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from "node:worker_threads";
import path from "node:path";
import { replaceData } from "../utils/public";
import { webhookLog } from "../utils/logger";
import ServerCache from "../utils/cache";

export type IRequestQueueData = {
  id: string;
  projectName?: string;
  inputDate: Date;
  urls: string[];
  params: Record<string, any>;
};

export type TExecuteResult = {
  status: "fulfilled" | "rejected";
  res: string;
  key: string;
  error?: string;
};

export default class RequestQueue {
  /** Pending Queue */
  private _list: IRequestQueueData[];
  /** Executing Length */
  private _executingLen: number;
  /** Maximum Executing Work Threads */
  private _maxExecLen: number;
  private _workerPath: string;

  constructor(max: number = 3) {
    this._list = [];
    this._executingLen = 0;
    this._maxExecLen = max;
    this._workerPath = path.resolve(__dirname, "worker.ts");
  }

  /** Push Task */
  public push(data: IRequestQueueData) {
    this._list.push(data);
    this.execute();
    return this._list.length;
  }

  /** Create a work thread and execute request task */
  private execute() {
    // Main Thread is used to create request worker
    if (this.getPendingLen() <= 0) {
      return;
    }
    // Get data from the pending queue
    const data = this._list.shift();
    this._executingLen++;

    // Create a work thread for request
    const worker = new Worker(this._workerPath, {
      execArgv: ["-r", "ts-node/register"],
      workerData: data,
    });

    worker.on("message", (res: TExecuteResult[] | string) => {
      if (!data) return;
      // Send Result to Cache/DB
      ServerCache.set(data.id, res);
    });
    worker.on("error", (err) => {
      // Catch error
      webhookLog.error({
        type: "work thread error",
        text: err,
      });
    });
    worker.on("exit", () => {
      this._executingLen--;
      if (this._executingLen < this._maxExecLen) {
        this.execute();
      }
    });
  }

  /** Return the length of the pending queue  */
  public getPendingLen() {
    return this._list.length;
  }
}
