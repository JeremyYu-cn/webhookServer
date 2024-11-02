type TFunc = (...params: any[]) => Promise<any>;

/**
 * Create a common request queue to execute functions uniformly.
 */
export default class QueryQueue {
  private _map: Map<string, TFunc>;
  private _executeMap: Map<string, Promise<any>>;

  constructor() {
    // Used to save original function
    this._map = new Map();
    // Used to save executing function
    this._executeMap = new Map();
  }

  // Register function
  public register(key: string, func: TFunc) {
    this._map.set(`${key}`, func);

    return this._map.size;
  }

  // Execute function
  public execute<T>(key: string, ...params: T[]) {
    if (!this._map.has(key)) throw "The Query method is not registered.";
    const accessKey = `${key}_${JSON.stringify(params)}`;
    if (!this._executeMap.has(accessKey)) {
      const execFunc = (<TFunc>this._map.get(key))(...params);
      this._executeMap.set(accessKey, execFunc);
      execFunc.then(() => {
        this._executeMap.delete(accessKey);
      });
      return execFunc;
    } else {
      return this._executeMap.get(accessKey);
    }
  }
}
