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

interface PaginatedSourceResponse {
  message: string;
  status: string;
  data: {
    sources: Source[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface SourcePayload {
  title: string;
  description: string;
}

interface CreateSourceResponse {
  message: string;
  status: string;
  data: Source;
}
export class SourceService extends ApiClient {
  constructor() {
    super("source");
  }

  async sources() {
    return this.get<SourceResponse>("fetch");
  }

  async getPaginatedSources(page = 1, limit = 10) {
    return this.get<PaginatedSourceResponse>(`/fetch`, {
      params: { page, limit },
    });
  }

  async createSource(payload: SourcePayload) {
    return this.post<CreateSourceResponse>("create", payload);
  }
}

export const sourceService = new SourceService();
