import { ApiClient } from "@/services/ApiClient.service";

export interface Lables {
  _id: string;
  description: string;
  title: string;
  meta: { is_active: boolean };
}

interface LableResponse {
  map(arg0: (label: any) => { _id: any; title: any; }): unknown;
  labels: never[];
  message: string;
  status: string;
  data: Lables[];
}

export class LabelService extends ApiClient {
  constructor() {
    super("label");
  }

  async labels() {
    return this.get<LableResponse>("all");
  }

}

export const labelService = new LabelService(); 
