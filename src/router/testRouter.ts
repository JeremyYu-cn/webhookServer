import Router from "@koa/router";
import { resFormat } from "../utils/format";

const router = new Router({});

/** Test Router */
router.get("/test/:projectName", async (ctx, next) => {
  const { projectName } = ctx.params;
  ctx.body = resFormat(true, `Hello ${projectName}`);

  await next();
});

export default router;
