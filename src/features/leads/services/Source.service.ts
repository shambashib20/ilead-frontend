import { ApiClient } from "@/services/ApiClient.service";

export interface Source {
  _id: string;
  description: string;
  title: string;
  meta: { is_active: boolean };
}

interface SourceResponse {
  message: string;
  status: string;
  data: {
    sources: Source[];
  };
}

export class SourceService extends ApiClient {
  constructor() {
    super("source");
  }

  async sources() {
    return this.get<SourceResponse>("fetch");
  }
}

export const sourceService = new SourceService();
