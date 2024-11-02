import { v4 } from "uuid";
import projectList from "../data/database";
import RequestQueue from "./execute";
import ServerCache from "../utils/cache";

const executeQueue = new RequestQueue();

/** To get webhook project list */
export async function getWebhookList(page: number = 1, size: number = 10) {
  return await projectList.getByPage(page, size);
}

/** To get project detail */
export async function getWebhookDetail(projectName: string) {
  return await projectList.getProjectByName(projectName);
}

/** To modify project detail */
export async function editWebhookDetail(
  projectName: string,
  data: TEditProjectBody
) {
  return await projectList.editProjectData(projectName, data);
}

/** To create project data */
export async function createWebhookDetail({
  name,
  status,
  list,
}: TAddProjectBody) {
  const uniqueId = v4();
  const insertData: IWebhookData = {
    id: uniqueId,
    name: name ?? "",
    status: status ?? false,
    list: list ?? [],
  };
  return await projectList.createProjectData(insertData);
}

/** To delete project data */
export async function deleteWebhookDetail(projectName: string) {
  return await projectList.deleteProjectData(projectName);
}

/** Execute webhook request */
export async function execWebhookByName(params: { projectName: string }) {
  const data = await getWebhookDetail(params.projectName);

  // Empty project record or off status will not execute this function
  if (!data || !data.status) return false;

  const requestId = v4();

  executeQueue.push({
    id: requestId,
    projectName: data.name,
    inputDate: new Date(),
    urls: data.list,
    params,
  });
  // Considering this request method will spend a long time, these requests will executed by work thred
  // Therefore, this method returns a requestId for user to request the execute result
  return requestId;
}

/** Get Webhook Execute Result */
export async function getExecuteResult(requestId: string) {
  return ServerCache.get(requestId);
}
