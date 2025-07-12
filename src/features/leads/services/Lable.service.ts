import { ApiClient } from "@/services/ApiClient.service";

export interface Lables {
  _id: string;
  description: string;
  title: string;
  meta: { is_active: boolean };
}

interface LableResponse {
  message: string;
  status: string;
  data: Lables[];
}

class LabelService extends ApiClient {
  constructor() {
    super("label");
  }

  async labels() {
    return this.get<LableResponse>("all");
  }

}

export const labelService = new LabelService(); 
