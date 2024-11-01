interface IRequestState {}

interface IRequestType {}

interface ICommonResponseT {}

interface IBodyRequest<T extends Record<string, any> = {}>
  extends IRequestType {
  body: T;
}

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
  }
}
