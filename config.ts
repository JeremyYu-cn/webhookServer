import path from "node:path";

type TConfig = {
  [key: string]: {
    port: number;
    logPath: string;
  };
};

const Config: TConfig = {
  development: {
    port: 10010,
    logPath: path.resolve(__dirname, "_log"),
  },
  production: {
    port: 10086,
    logPath: path.resolve(__dirname, "_log"),
  },
};

export default Config[process.env.NODE_ENV ?? "development"];
