/**
 * Replace Template String Method
 * @param {string} data String
 * @param {Object} params Replace Parameters
 * @returns
 */
export function replaceData(data: string, params: Record<string, any>) {
  let res = data;
  for (let key in params) {
    res = res.replace(new RegExp(`{${key}}`, "g"), params[key]);
  }

  return res;
}
