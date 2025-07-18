import { ApiClient } from "@/services/ApiClient.service";

export type Lead = {
  _id: string;
  name: string;
  company_name: string;
  phone_number: string;
  email: string;
  address: string;
  comment: string;
  reference: string;
  createdAt: string;
};

export type Status = {
  _id: string;
  title: string;
};

export type Source = {
  _id: string;
  title: string;
};

export type DeleteLeadPayload = {
  rayId: string;
  deleteReason: string;
};
interface LeadsPerStatusResponse {
  message: string;
  status: string;
  data: {
    labels: Status[];
    data: number[];
  };
}

interface LeadsPerSourceResponse {
  message: string;
  status: string;
  data: {
    sources: Source[];
    data: number[];
  };
}

interface DeleteLeadsResponse {
  message: string;
  status: string;
}

class LeadsModule extends ApiClient {
  constructor() {
    super("lead");
  }

  async getLeadsAccordingToStatus(params: {
    startDate?: string;
    endDate?: string;
    agentId: string;
  }) {
    return this.get<LeadsPerStatusResponse>("/leads-per-status", { params });
  }
  async getLeadsAccordingToSource(params: {
    startDate?: string;
    endDate?: string;
    agentId: string;
  }) {
    return this.get<LeadsPerSourceResponse>("/leads-per-source", { params });
  }

  async deleteLeads(payload: DeleteLeadPayload) {
    const response = await this.patch<DeleteLeadsResponse>(
      "/delete-lead",
      payload
    );
    return response.data;
  }
}

export const statsService = new LeadsModule();
export const sourceStatsService = new LeadsModule();
export const deleteLeadsService = new LeadsModule();
