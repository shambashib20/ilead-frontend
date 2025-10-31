import { ApiClient } from "@/services/ApiClient.service";

export interface Leads {
  _id: string;
  name: string;
  company_name: string;
  logs: [];
  statuses: { _id: string; title: string; meta: { color_code: string } }[];
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
    assigned_to: {
      name: string;
      email: string;
    };
    status: { _id: string };
    comment: string;
    assigned_by: { name: string };

    labels: [{ _id: string; title: string; meta: { color_code: string } }];
    follow_ups: [];
  }[];
  pagination: Pagination;
}
export type FilterPayload = {
  labelIds?: string[];
  assignedTo?: string[];
  sourceNames?: string[];
  search: string;
  sortBy: string;
  assignedBy?: string[];
  is_table_view?: boolean;
  page?: number;
  limit?: number;
  startDate?: Date | string;
  endDate?: Date | string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export interface LeadsResponse {
  message: string;
  status: string;
  data: Leads;
  pagination?: Pagination;
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
      assignedBy: filters.assignedBy,
      sourceNames: filters.sourceNames,
      search: filters.search,
      sortBy: filters.sortBy,
      is_table_view: filters.is_table_view ?? false,
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      start_date: filters?.startDate,
      end_date: filters?.endDate,
    });
    return response.data;
  }
}

export const leadsService = new LeadsService();
