import type Koa from "koa";
import { globalLog } from "../utils/logger";
import { logFormat } from "../utils/format";
/**
 * A common error handler, which is used to handle server's unknown error.
 * And report to backend
 */
export default async function errorHandle(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  next: Koa.Next
) {
  try {
    await next();
  } catch (err) {
    globalLog.error(logFormat(ctx, err));
    ctx.res.statusCode = 500;
    ctx.res.end("Server Error");
  }
}
