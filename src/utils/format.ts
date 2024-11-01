import type Koa from "koa";

/**
 * A common meethod to format response data
 * @param success
 * @param data
 * @param code
 * @returns
 */
export function resFormat<T extends any>(
  success: boolean,
  data: T,
  code: number = 200
) {
  return {
    success,
    data,
    code,
  };
}

/**
 * To format server error log
 * @param {Koa.ParameterizedContext} ctx Koa instance's context
 * @param {string} err Error Text
 * @returns
 */
export function logFormat(
  ctx: Koa.ParameterizedContext<IRequestState, IBodyRequest, ICommonResponseT>,
  err: unknown
) {
  return JSON.stringify({
    path: ctx.request.URL,
    params: JSON.stringify(ctx.body) ?? "",
    errText: err,
  });
}
