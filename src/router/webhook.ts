import Router from "@koa/router";
import {
  createWebhookDetail,
  deleteWebhookDetail,
  editWebhookDetail,
  execWebhookByName,
  getExecuteResult,
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

/** Execute Project's webhook */
router.post("/exec/:name", async (ctx) => {
  const params = <TProjectParams>ctx.params;
  const res = await execWebhookByName({ projectName: params.name });
  ctx.body = resFormat(true, { requestId: res });
});

/** Get Execute Result */
router.get("/exec/:requestId", async (ctx) => {
  const { requestId } = ctx.params;
  if (!requestId) {
    ctx.body = resFormat(false, null, "Parameter reuestId cannot be null.");
  }
  const res = await getExecuteResult(requestId);
  ctx.body = resFormat(true, res);
});

export default router;
