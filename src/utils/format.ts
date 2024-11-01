/**
 * A common meethod to format response data
 * @param success
 * @param data
 * @param code
 * @returns
 */
export function resFormat<T extends any>(
  success: boolean,
  data: T,
  code: number = 200
) {
  return {
    success,
    data,
    code,
  };
}
