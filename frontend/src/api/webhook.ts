const baseUrl = `${import.meta.env.VITE_REQUEST_BASE_URL}/api/webhook/project`;

function commonReturn<T extends any>(
  success: boolean,
  data: T,
  err?: string
): APIData<T> {
  return {
    success,
    data,
    err,
  };
}

/**
 * Get Webhook Project List
 * @param {Number} page request page
 * @param {Number} size number of columns
 */
export async function getProjectList(
  page: number = 1,
  size: number = 10
): Promise<APIData<IWebhookData[]>> {
  const query = new URLSearchParams({
    page: `${page}`,
    size: `${size}`,
  });
  const data = await fetch(`${baseUrl}/list?${query}`);
  if (!data.ok) return commonReturn(false, [], "network error");
  const json: APIData<IWebhookData[]> = await data.json();
  if (!json.success) return commonReturn(false, [], "query error");

  return json;
}

/**
 * Request Execute Webhook Project
 * @param {string} projectName
 */
export async function executeProject(
  projectName: string
): Promise<APIData<null>> {
  const data = await fetch(`${baseUrl}/exec/${projectName}`, {
    method: "POST",
  });

  if (!data.ok) return commonReturn(false, null, "network error");
  const json: APIData<null> = await data.json();
  if (!json.success) return commonReturn(false, null, "execute error");

  return json;
}

/**
 * Request Delete Project
 * @param projectName
 * @returns
 */
export async function deleteProject(
  projectName: string
): Promise<APIData<null>> {
  const data = await fetch(`${baseUrl}/${projectName}`, {
    method: "DELETE",
  });

  if (!data.ok) return commonReturn(false, null, "network error");
  const json: APIData<null> = await data.json();
  if (!json.success) return commonReturn(false, null, "delete error");

  return json;
}

/**
 * Request Delete Project
 * @param projectName
 * @returns
 */
export async function editProject(
  projectName: string,
  data: Partial<Omit<IWebhookData, "id" | "name">>
): Promise<APIData<null>> {
  const res = await fetch(`${baseUrl}/${projectName}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return commonReturn(false, null, "network error");
  const json: APIData<null> = await res.json();
  if (!json.success) return commonReturn(false, null, "delete error");

  return json;
}
