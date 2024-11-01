type TConfig = {
  port: number;
};

const Config = {
  development: {
    port: 10010,
  },
  production: {
    port: 10086,
  },
}[process.env.NODE_ENV ?? "development"] as TConfig;

export default Config;
