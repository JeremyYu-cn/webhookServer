import Router from "@koa/router";
import {
  createWebhookDetail,
  deleteWebhookDetail,
  editWebhookDetail,
  getWebhookDetail,
  getWebhookList,
} from "../method/webhook";
import { resFormat } from "../utils/format";

type TProjectParams = {
  name: string;
};

type TProjectListQuery = {
  page?: number;
  size?: number;
};

const router = new Router({
  prefix: "/webhook/project",
});

/** Get Project List */
router.get("/list", async (ctx) => {
  const { page, size } = <TProjectListQuery>ctx.query;
  const list = await getWebhookList(page, size);

  ctx.body = resFormat(true, list);
});

/** Get Project Detail By Name */
router.get("/:name", async (ctx) => {
  const { name } = <TProjectParams>ctx.params;
  const list = await getWebhookDetail(name);
  ctx.body = resFormat(true, list);
});

/** Modify Project Record By ProjectName */
router.put("/:name", async (ctx) => {
  const { name } = <TProjectParams>ctx.params;
  const body = <TEditProjectBody>ctx.body;
  if (!body) {
    ctx.body = resFormat(false, null, "Param Insufficient");
    return;
  }

  const res = await editWebhookDetail(name, body);
  ctx.body = resFormat(res, null);
});

/** Create New Project Record */
router.post("/", async (ctx) => {
  const body = <TAddProjectBody>ctx.body;
  if (!body.name) {
    ctx.body = resFormat(false, null, "Name cannot be null");
    return;
  }
  const res = await createWebhookDetail(body);
  ctx.body = resFormat(res, null);
});

/** Delete Project Record */
router.delete("/:name", async (ctx) => {
  const { name } = <TProjectParams>ctx.params;
  const res = await deleteWebhookDetail(name);
  ctx.body = resFormat(res, null);
});

router.post("/exec/:name", async (ctx) => {
  const params = <TProjectParams>ctx.params;
});

export default router;
