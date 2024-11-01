import Router from "@koa/router";
import webhookRouter from "./webhook";

const router = new Router();
router.prefix("/api");

router.use(webhookRouter.routes());
router.use(webhookRouter.allowedMethods());

export default router;
