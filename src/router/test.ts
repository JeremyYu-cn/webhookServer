import Router from "@koa/router";
import { resFormat } from "../utils/format";

const router = new Router({});

/** Get Project List */
router.get("/test/:projectName", async (ctx) => {
  const { projectName } = ctx.params;
  ctx.body = resFormat(true, `Hello ${projectName}`);
});

export default router;
