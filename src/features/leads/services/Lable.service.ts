import { ApiClient } from "@/services/ApiClient.service";

export interface Agents {
  agent_id: {
    name: string;
  };
}

export interface Lables {
  _id: string;
  description: string;
  title: string;
  meta: { is_active: boolean; assigned_agents: Agents[] };
}

interface LableResponse {
  map(arg0: (label: any) => { _id: any; title: any }): unknown;
  labels: never[];
  message: string;
  status: string;
  data: Lables[];
}

export interface CreateLabelResponse {
  message: string;
  status: string;
  data: Lables;
}

export interface LabelPayload {
  title: string;
  description: string;
}

interface PaginatedLabelResponse {
  message: string;
  status: string;
  data: {
    labels: Lables[];
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

interface EditLabelPayload {
  title: string;
  description: string;
  data?: Lables;
}

interface EditLabelResponse {
  message: string;
  status: string;
  data: Lables;
}

interface DeleteLabelParams {
  labelId: string;
}
export class LabelService extends ApiClient {
  constructor() {
    super("label");
  }

  async labels() {
    return this.get<LableResponse>("all");
  }

  async getPaginatedLables(page = 1, limit = 10) {
    return this.get<PaginatedLabelResponse>(`/fetch-paginated/all`, {
      params: { page, limit },
    });
  }

  async createLabel(payload: LabelPayload): Promise<CreateLabelResponse> {
    const res = await this.post<CreateLabelResponse>("/create", payload);
    return res.data;
  }

  async editLabel(
    labelId: string,
    payload: EditLabelPayload
  ): Promise<EditLabelResponse> {
    const res = await this.put<EditLabelResponse>(
      `/update/${labelId}`,
      payload
    );
    return res.data;
  }

  async deleteLabel({ labelId }: DeleteLabelParams) {
    const res = await this.delete<{ message: string; status: string }>(
      `/delete/${labelId}`
    );
    return res.data;
  }
}

export const labelService = new LabelService();
