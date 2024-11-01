import log4js from "log4js";
import path from "node:path";
import config from "../../config";

log4js.configure({
  appenders: {
    webhook: {
      type: "file",
      filename: path.resolve(config.logPath, "webhook.log"),
    },
    global: {
      type: "file",
      filename: path.resolve(config.logPath, "global.log"),
    },
  },
  categories: {
    default: { appenders: ["webhook"], level: "ALL" },
    global: { appenders: ["global"], level: "ALL" },
  },
});

export const webhookLog = log4js.getLogger("webhook");
export const globalLog = log4js.getLogger("global");
