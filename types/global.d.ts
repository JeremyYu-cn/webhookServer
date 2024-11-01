interface IRequestState {}

interface IRequestType {}

interface ICommonResponseT {}

interface IBodyRequest<T extends Record<string, any> = {}>
  extends IRequestType {
  body: T | unknown;
}

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
