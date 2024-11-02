import { v4 } from "uuid";
import projectList from "../data/database";
import RequestQueue from "./execute";
import ServerCache from "../utils/cache";
import QueryQueue from "../utils/reqQueue";

const executeQueue = new RequestQueue();
const queryQueue = new QueryQueue();

// Registed query queue function
// These methods are used to prevent the same request from making repeated requests to the database
queryQueue.register(
  "projectList.getByPage",
  projectList.getByPage.bind(projectList)
);
queryQueue.register(
  "projectList.getProjectByName",
  projectList.getProjectByName.bind(projectList)
);

/** Common webhook detail key */
function getWebHookCacheKey(projectName: string) {
  return `webhook_detail_${projectName}_record`;
}

/** To get webhook project list */
export const getWebhookList = async function getWebhookList(
  page: number,
  size: number
) {
  return await queryQueue.execute("projectList.getByPage", page, size);
};

/** To get project detail */
export async function getWebhookDetail(
  projectName: string
): Promise<IWebhookData | null | undefined> {
  const cacheKey = getWebHookCacheKey(projectName);

  // Use cache to reduce request time
  if (ServerCache.has(cacheKey)) {
    return ServerCache.get(cacheKey);
  }

  // Query Data
  const result = await queryQueue.execute(
    "projectList.getProjectByName",
    projectName
  );

  // Add Request Cache
  if (ServerCache.checkIsExpired(cacheKey)) {
    ServerCache.set(cacheKey, result, 200);
  }

  return result;
}

/** To modify project detail */
export async function editWebhookDetail(
  projectName: string,
  data: TEditProjectBody
) {
  const result = await projectList.editProjectData(projectName, data);

  // if success, reset cache
  if (result) {
    const cacheKey = getWebHookCacheKey(projectName);
    ServerCache.set(cacheKey, await getWebhookDetail(projectName));
  }

  return result;
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
  const result = await projectList.deleteProjectData(projectName);

  // If success, delete cache
  if (result) {
    const cacheKey = getWebHookCacheKey(projectName);
    ServerCache.delete(cacheKey);
  }

  return result;
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
