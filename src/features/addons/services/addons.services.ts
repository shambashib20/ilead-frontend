import { ApiClient } from "@/services/ApiClient.service";

/* ---------- types ---------- */

export interface AddonListPayload {
  page: number;
  limit: number;
}

export interface Addon {
  _id: string;
  title: string;
  description: string;
  value: number;
  status: string;
  property_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddonPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AddonResponse {
  data: {
    addons: Addon[];
    pagination: AddonPagination;
  };
}

type CreateAddonPayload = {
  title: string;
  description: string;
  value: string;
};

type CreateAddonResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export type UpdateAddonPayload = {
  addOnId: string;
  title: string;
  description: string;
  value: string;
  status: string;
};

export type UpdateAddonResponse = {
  success: boolean;
  message: string;
  data?: any;
};

/* ---------- service ---------- */

class AddonService extends ApiClient {
  constructor() {
    super("addons");
  }

  getAllAddons(page: number = 1, limit: number = 10) {
    return this.get<AddonResponse>(`/fetch?page=${page}&limit=${limit}`);
  }

  createAddons(payload: CreateAddonPayload) {
    return this.post<CreateAddonResponse>(`/create`, payload);
  }
  updateAddons(payload: UpdateAddonPayload) {
    return this.patch<UpdateAddonResponse>(`/edit`, payload);
  }
}

/* singleton export */
export const addonService = new AddonService();
