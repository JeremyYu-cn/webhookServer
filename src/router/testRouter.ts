import Router from "@koa/router";
import { resFormat } from "../utils/format";

const router = new Router({});

/** Test Router */
router.get("/test", async (ctx, next) => {
  ctx.body = resFormat(true, `Hello World`);

  await next();
});

export default router;
