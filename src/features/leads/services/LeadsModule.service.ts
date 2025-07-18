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
interface LeadsPerStatusResponse {
  message: string;
  status: string;
  data: {
    labels: Status[];
    data: number[];
  };
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
}

export const statsService = new LeadsModule();
