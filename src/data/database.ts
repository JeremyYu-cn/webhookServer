// Mock Database Request Data
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Mock Database Collection
 */
class ProjectList {
  private _list?: IWebhookData[];
  private _colPath: string;

  constructor() {
    this._colPath = path.resolve(__dirname, "collection.json");
  }

  /** Get data from DB */
  private async init() {
    this._list = JSON.parse(await fs.readFile(this._colPath, "utf-8"));
  }

  /** Get Project By List */
  public async getByPage(page: number = 1, size: number = 10) {
    if (!this._list) await this.init();
    const ignoreNum = (page - 1) * size;
    return this._list?.slice(ignoreNum > 0 ? ignoreNum - 1 : 0, size);
  }

  /** Get Project Detail */
  public async getProjectByName(projectName?: string) {
    if (!this._list) await this.init();

    const index =
      this._list?.findIndex((val) => val.name === projectName) ?? -1;
    return index === -1 ? null : this._list?.[index];
  }

  /** Get Project Detail by ID */
  public async getProjectById(id?: string) {
    if (!this._list) await this.init();

    const index = this._list?.findIndex((val) => val.id === id) ?? -1;
    return index === -1 ? null : this._list?.[index];
  }

  /** Modify Project Detail */
  public async editProjectData(projectName: string, data: TEditProjectBody) {
    if (!this._list) await this.init();

    const index =
      this._list?.findIndex((val) => val.name === projectName) ?? -1;
    if (index === -1 || !this._list) return false;

    this._list[index] = {
      id: this._list[index].id,
      name: projectName,
      status: data.status ?? this._list[index].status,
      list: data.list ?? this._list[index].list,
    };

    // Mock update project data into DB
    await fs.writeFile(this._colPath, JSON.stringify(this._list));

    return true;
  }

  /** Create Project Record */
  public async createProjectData(data: IWebhookData) {
    if (!this._list) await this.init();
    const index = this._list?.findIndex((val) => val.name === data.name) ?? -1;
    if (index > -1 || !this._list) return false;

    this._list.push(data);

    // Mock insert project data into DB
    await fs.writeFile(this._colPath, JSON.stringify(this._list));

    return true;
  }

  /** To delete project record */
  public async deleteProjectData(name: string) {
    if (!this._list) await this.init();
    const index = this._list?.findIndex((val) => val.name === name) ?? -1;
    if (index > -1 || !this._list) return false;

    this._list.splice(index, 1);

    // Mock delete project data into DB
    await fs.writeFile(this._colPath, JSON.stringify(this._list));

    return true;
  }
}

export default new ProjectList();
