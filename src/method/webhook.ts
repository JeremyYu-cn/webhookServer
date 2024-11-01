import projectList from "../data/database";
import url from "node:url";
import { v4 } from "uuid";

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

/** To execute webhook */
export async function execWebhookByName(params: { projectName: string }) {
  const data = await getWebhookDetail(params.projectName);
  if (!data) return false;

  const list = data.list.map((val) => {});
}
