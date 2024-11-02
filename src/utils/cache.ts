type TCacheData = {
  /** Cache key */
  createDate: Date;
  /** Cache value */
  value: any;
  /** Expired Time (Unit: second) */
  during?: number;
};

/**
 * Server's cache
 * It used to mock Redis or other memory-based databases.
 */
export default class ServerCache {
  private static _map: Map<string, TCacheData> = new Map();
  constructor() {}

  static init() {
    this.clearData();
  }

  /**
   *
   * @param {string} key Cache key
   * @param {any} value  Cache value
   * @param {number} during Cache during time (Unit: second)
   */
  static set(key: string, value: any, during?: number) {
    this._map.set(key, {
      createDate: new Date(),
      value,
      during,
    });
  }

  /** Get Cache Data */
  static get(key: string) {
    const val = this._map.get(key);
    if (!val) return null;
    if (!val.during) return val.value;
    // Check whether the value is expired or not
    const expiredDate = val.createDate.getUTCSeconds() + val.during;
    const currentDate = new Date().getUTCSeconds();
    return currentDate > expiredDate ? null : val.value;
  }

  /** Delete Cache */
  static delete(key: string) {
    this._map.delete(key);

    return true;
  }

  /** Check whether a key exists in cache or not. */
  static has(key: string) {
    return this._map.has(key);
  }

  /**
   * Get cache's expired status
   * @param {string} key Cache Key
   * @param {number} deviation Unit: second
   * @returns boolean
   */
  static checkIsExpired(key: string, deviation: number = 60) {
    if (!this._map.has(key)) return true;
    const tmp = this._map.get(key);
    if (!tmp) return true;
    const expiredDate =
      tmp.createDate.getUTCSeconds() + (tmp?.during ?? 0) + deviation;
    return new Date().getUTCSeconds() - expiredDate > 0;
  }

  /**
   * This method is used to clear expired key periodly
   */
  private static clearData() {
    setTimeout(() => {
      const currentDate = new Date().getUTCSeconds();
      const deleteList: string[] = [];
      this._map.forEach((val, key) => {
        if (val.during) {
          const expiredDate = val.createDate.getUTCSeconds() + val.during;
          if (currentDate > expiredDate) deleteList.push(key);
        }
      });
      deleteList.forEach((val) => {
        this._map.delete(val);
      });
      this.clearData();
    }, 10000);
  }
}
