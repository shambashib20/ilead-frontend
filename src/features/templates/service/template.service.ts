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
export interface UpdateTemplatePayload {
  type?: string;
  title?: string;
  message?: string;
  subject?: string;
  email_message?: string;
  sms_template_id?: string;
}

export interface DeleteTemplateResponse {
  message: string;
  statusCode: number;
  data: { deleted: boolean; templateId: string };
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
      const response = await this.post<CreateCampaignResponse>(
        "/create",
        payload
      );
      return response.data.data.campaign;
    } catch (err) {
      console.error("❌ Failed to create campaign:", err);
      throw err;
    }
  }

  async getTemplateById(id: string): Promise<Campaign> {
    const res = await this.get<{ data: Campaign }>(`/template/${id}`);
    return res.data.data;
  }

  async updateTemplate(id: string, payload: UpdateTemplatePayload): Promise<Campaign> {
    const res = await this.patch<{ data: Campaign }>(`/template/${id}`, payload);
    return res.data.data;
  }

  async deleteTemplate(id: string): Promise<DeleteTemplateResponse> {
    const res = await this.delete<DeleteTemplateResponse>(`/template/${id}`);
    return res.data;
  }
}

export const templateService = new TemplateService(); // singleton
