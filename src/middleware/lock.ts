import type Koa from "koa";
import ServerCache from "../utils/cache";

function requestCacheKey(userId: string, method: string, path: string) {
  return `reuest_lock_${userId}_${method}_${path}`;
}

/**
 * This method is a Koa middleware that used to lock request users,
 * such that each user is only allowed to request one time in a peroid.
 */
export async function requestLock(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  next: Koa.Next
) {
  // Generally, the first parameter is userId
  const cacheKey = requestCacheKey(ctx.ip, ctx.method, ctx.path);
  // Check whether the lock is exists or not
  if (ServerCache.has(cacheKey)) {
    ctx.body = "Your request is pending, please wait.";
    return;
  }

  // ignore GET and OPTION request method
  if (!["GET", "OPTION"].includes(ctx.method.toLocaleUpperCase())) {
    ServerCache.set(cacheKey, 1);
  }

  await next();
}

export async function releaseReqLock(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
  next: Koa.Next
) {
  const cacheKey = requestCacheKey(ctx.ip, ctx.method, ctx.path);
  ServerCache.delete(cacheKey);

  await next();
}
