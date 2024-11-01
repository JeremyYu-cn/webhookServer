interface IWebhookData {
  /** Project ID */
  id: string;
  /** Project Name */
  name: string;
  /** Project Status */
  status: boolean;
  /** Webhook API List */
  list: string[];
}

type TEditProjectBody = Partial<Omit<IWebhookData, "id" | "name">>;
type TAddProjectBody = Partial<Omit<IWebhookData, "id">>;
