type TCacheData = {
  /** Cache key */
  createDate: Date;
  /** Cache value */
  value: any;
  /** Expired Time (Unit: second) */
  expired?: number;
};

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
   * @param {number} expired Expired Time (Unit: second)
   */
  static set(key: string, value: any, expired?: number) {
    this._map.set(key, {
      createDate: new Date(),
      value,
      expired,
    });
  }

  /** Get Cache Data */
  static get(key: string) {
    const val = this._map.get(key);
    if (!val) return null;
    if (!val.expired) return val.value;
    // Check whether the value is expired or not
    const expiredDate = val.createDate.getUTCSeconds() + val.expired;
    const currentDate = new Date().getUTCSeconds();
    return currentDate > expiredDate ? null : val.value;
  }

  private static clearData() {
    setTimeout(() => {
      const currentDate = new Date().getUTCSeconds();
      const deleteList: string[] = [];
      this._map.forEach((val, key) => {
        if (val.expired) {
          const expiredDate = val.createDate.getUTCSeconds() + val.expired;
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
