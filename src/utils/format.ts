import type Koa from "koa";

/**
 * A common method to format response data
 * @param {boolean} success To mark whether this request is success or not
 * @param {any} data Response data
 * @param {number} code http status code
 * @returns
 */
export function resFormat<T extends any>(
  success: boolean,
  data: T,
  err: string | null = null
) {
  return {
    success,
    data,
    err,
  };
}

/**
 * To format server error log
 * @param {Koa.ParameterizedContext} ctx Koa instance's context
 * @param {string} err Error Text
 * @returns string
 */
export function logFormat(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  text: unknown
) {
  return JSON.stringify({
    path: ctx.request.URL,
    params: ctx.body ? JSON.stringify(ctx.body) : "",
    text: text,
  });
}
