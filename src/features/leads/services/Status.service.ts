import { ApiClient } from "@/services/ApiClient.service";

export interface Status {
  _id: string;
  description: string;
  title: string;
  property_id: string;
  meta: { is_active: boolean };
}

interface StatusResponse {
  message: string;
  status: string;
  data: Status[];
}

interface PaginatedStatusResponse {
  message: string;
  status: string;
  data: {
    statuses: Status[];
    pagination: {
      total: number;
      currentPage: number;
      limit: number;
      totalPage: number;
    };
  };
}
/**
 * Service for auth routes (auto-prefixes with /auth)
 */
export class StatusService extends ApiClient {
  constructor() {
    super("status");
  }

  async status() {
    return this.get<StatusResponse>("all");
  }

  async getPaginatedStatuses(page = 1, limit = 10) {
    return this.get<PaginatedStatusResponse>(`/paginated-statuses`, {
      params: { page, limit },
    });
  }
}

export const statusService = new StatusService(); // singleton
