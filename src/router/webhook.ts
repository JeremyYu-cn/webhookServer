import Router from "@koa/router";

const router = new Router({
  prefix: "/webhook",
});

router.get("/:projectName", (ctx) => {
  throw "test error";
  ctx.res.end("Hello World");
});

export default router;
