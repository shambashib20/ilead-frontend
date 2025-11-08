// src/features/payment/services/Addons.service.ts
import { ApiClient } from "@/services/ApiClient.service";

/**
 * Types for the API response
 */
export type AddonStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export interface Addon {
  _id: string;
  title: string;
  description?: string | null;
  value: number;
  status: AddonStatus;
  property_id?: string | null;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AddonsData {
  addons: Addon[];
  pagination: Pagination;
}

export interface AddonPlansResponse {
  message: string;
  status: "SUCCESS" | "FAIL" | string;
  data: AddonsData;
}

/**
 * Service
 */
class AddonsService extends ApiClient {
  constructor() {
    super("addons"); // this.modulePath becomes /addons
  }

  /**
   * Fetch addon plans
   * @param params page and limit (optional, defaults provided)
   */
  async getAddonPlans({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  } = {}): Promise<AddonPlansResponse> {
    // fixed query string (was missing '=' after page)
    const res = await this.get<AddonPlansResponse>(
      `/fetch?page=${page}&limit=${limit}`
    );
    return res.data;
  }
}

/** 🔄 Export singleton for reuse */
export const addonsService = new AddonsService();
export default addonsService;
