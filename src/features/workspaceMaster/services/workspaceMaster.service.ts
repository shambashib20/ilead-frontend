import { ApiClient } from "@/services/ApiClient.service";

/* ---------- types ---------- */

export interface WorkspaceMasterListPayload {
  page: number;
  limit: number;
}

export interface Property {
  _id: string;
  name: string;
  description?: string;
  usage_limits?: number;
  usage_count?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceMasterPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface WorkspaceResponse {
  data: {
    properties: Property[];
    pagination: WorkspaceMasterPagination;
  };
}

/* ---------- service ---------- */

class WorkspaceMasterService extends ApiClient {
  constructor() {
    super("property");
  }

  getAllWorkspaces(payload: WorkspaceMasterListPayload) {
    console.log("Service payload:", payload);
    return this.post<WorkspaceResponse>(`/all`, payload);
  }
}

/* singleton export */
export const workspaceMasterService = new WorkspaceMasterService();
