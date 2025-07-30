import { ApiClient } from "@/services/ApiClient.service";

export interface Leads {
  _id: string;
  name: string;
  company_name: string;
  logs: [];
  statuses: { _id: string; title: string }[];
  leads: {
    meta: {};
    email: string;
    company_name: string;
    address: string;
    _id: string;
    title: string;
    reference: string;
    name: string;
    phone_number: string;
    createdAt: string;
    assigned_to: { name: String };
    status: { _id: string };
    comment: string;
    assigned_by: { name: string };
    labels: [{ _id: string; title: string }];
  }[];
}
export type FilterPayload = {
  labelIds?: string[];
  assignedTo?: string[];
  sourceNames?: string[];
  search: string;
  sortBy: string;
  createdByIds?: string[];
};

export interface LeadsResponse {
  message: string;
  status: string;
  data: Leads;
}

class LeadsService extends ApiClient {
  constructor() {
    super("home-page");
  }

  // rename to reflect “search”
  async searchLeads(filters: FilterPayload): Promise<LeadsResponse> {
    const response = await this.post<LeadsResponse>("/all/leads", {
      labelIds: filters.labelIds,
      assignedTo: filters.assignedTo,
      sourceNames: filters.sourceNames,
      search: filters.search,
      sortBy: filters.sortBy,
    });
    return response.data;
  }
}

export const leadsService = new LeadsService();
