import Router from "@koa/router";
import webhookRouter from "./webhook";
import testRouter from "./testRouter";

const router = new Router();
router.prefix("/api");

router.use(webhookRouter.routes());
router.use(webhookRouter.allowedMethods());

router.use(testRouter.routes());
router.use(testRouter.allowedMethods());

export default router;
