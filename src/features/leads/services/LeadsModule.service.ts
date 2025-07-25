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
  meta: any;
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

export type ChangeLeadStatusPayload = {
  leadId: string;
  statusId: string;
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

interface LeadDetailsResponse {
  message: string;
  status: string;
  data: Lead;
}

interface DeleteLeadsResponse {
  message: string;
  status: string;
}

interface AssignLabelResponse {
  message: string;
  status: string;
}

export type AssignLabelPayload = {
  leadId: string;
  labelIds: string[];
};

interface ChangeLeadStatusResponse {
  message: string;
  status: string;
}

export class LeadsModule extends ApiClient {
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

  async getLeadInfo(params: { leadId: string }) {
    return this.get<LeadDetailsResponse>("/info", { params });
  }

  async assignLabelToLead(payload: AssignLabelPayload) {
    const response = await this.patch<AssignLabelResponse>("/update", payload);
    return response.data;
  }

  async updateLeadStatus(payload: ChangeLeadStatusPayload) {
    const response = await this.patch<ChangeLeadStatusResponse>(
      "/update-status",
      payload
    );
    return response.data;
  }
}

export const statsService = new LeadsModule();
export const sourceStatsService = new LeadsModule();
export const deleteLeadsService = new LeadsModule();
export const leadDetailsService = new LeadsModule();
