import Router from "@koa/router";

const router = new Router({
  prefix: "/webhook",
});

router.get("/:projectName", (ctx) => {
  console.log("123");
  ctx.res.end("Hello World");
});

export default router;
