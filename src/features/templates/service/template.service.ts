import { ApiClient } from "@/services/ApiClient.service";

/* -----------------------------
 *  Interfaces
 * ----------------------------- */

export interface Campaign {
  _id: string;
  type: string;
  title: string;
  message: string;
  attachments: any[];
  property_id: string;
  meta: {
    ray_id?: string;
    variable_map: Record<string, string>;
    is_active?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ✅ represents the "inner" data your API sends
export interface CampaignData {
  campaigns: Campaign[];
  pagination: PaginationMeta;
}

// ✅ represents the "outer" axios response wrapper
export interface CampaignResponse {
  data: CampaignData;
}

export interface CampaignQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}

/* ---------- types (add to the top with your existing types) ---------- */

export interface CreateCampaignPayload {
  type: string;
  title: string;
  message: string;
  attachments?: any[]; // adjust shape if you have a strict attachment type
  property_id: string;
  meta?: {
    ray_id?: string;
    variable_map?: Record<string, string>;
    is_active?: boolean;
    [key: string]: any;
  };
}

export interface CreateCampaignResponse {
  // adapt if your backend returns different shape;
  // here we expect the newly created campaign inside data.campaign (common pattern)
  data: {
    campaign: Campaign;
  };
}
/* -----------------------------
 *  Service Class
 * ----------------------------- */

export class TemplateService extends ApiClient {
  constructor() {
    super("campaign");
  }

  /**
   * Fetch paginated campaigns
   * @param params - page, limit, search, etc.
   * @returns CampaignData (campaigns + pagination)
   */
  async getCampaigns(params: CampaignQueryParams = {}): Promise<CampaignData> {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 10),
      ...(params.search ? { search: params.search } : {}),
    }).toString();

    try {
      const response = await this.get<CampaignResponse>(`/fetch?${query}`);
      return response.data.data; // ✅ now typed correctly
    } catch (err) {
      console.error("❌ Failed to fetch campaigns:", err);
      throw err;
    }
  }

  /**
   * Create a new campaign
   * POST /campaign/create-camaigns   <-- using your provided endpoint name
   *
   * @param payload CreateCampaignPayload
   * @returns the created Campaign
   */
  async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
    try {
      // NOTE: endpoint name uses the same text you provided.
      // If your real endpoint is different (e.g. "/create" or "/create-campaigns"),
      // change it here.
      const response = await this.post<CreateCampaignResponse>(
        "/create",
        payload
      );

      // If backend returns other shape, adapt this line
      return response.data.data.campaign;
    } catch (err) {
      console.error("❌ Failed to create campaign:", err);
      throw err;
    }
  }
}

export const templateService = new TemplateService(); // singleton
