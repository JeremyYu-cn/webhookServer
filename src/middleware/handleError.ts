import type Koa from "koa";
/**
 * This is a common error handler, which is used to handle unknown error.
 * And report to backend
 */
export default async function errorHandle(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  next: Koa.Next
) {
  try {
    await next();
  } catch (err) {
    ctx.res.statusCode = 500;
    ctx.res.end("Server Error");
  }
}
