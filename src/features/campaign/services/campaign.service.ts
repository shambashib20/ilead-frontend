import type { Property } from "@/features/workspace/services/Property.service";
import { ApiClient } from "@/services/ApiClient.service";

/* ---------- types ---------- */

export interface CampaignListPayload {
  page: number;
  limit: number;
}

interface PropertyObject {
  _id: string;
  name: string;
}

export interface Campaign {
  _id: string;
  type: string;
  title: string;
  message: string;
  attachments: any[];
  property_id: PropertyObject;
  meta?: {
    ray_id?: string;
    variable_map?: Record<string, string>;
    is_active?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CampaignPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CampaignResponse {
  data: {
    campaigns: Campaign[];
    pagination: CampaignPagination;
  };
}

/* ---------- service ---------- */

class CampaignService extends ApiClient {
  constructor() {
    super("campaign");
  }

  getAllCampaigns(page: number = 1, limit: number = 10) {
    return this.get<CampaignResponse>(
      `/master-panel/fetch?page=${page}&limit=${limit}`
    );
  }
}

/* singleton export */
export const campaignService = new CampaignService();
