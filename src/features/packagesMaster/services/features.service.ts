// =====================================================
// src/services/Feature.service.ts
// =====================================================

import { ApiClient } from "@/services/ApiClient.service";

/* ---------- types ---------- */

export interface Feature {
  _id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | string;
  meta?: {
    limit?: number;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FeaturesResponse {
  message: string;
  status: "SUCCESS" | "FAILED" | string;
  data: {
    items: Feature[];
  };
}

export interface CreateFeaturePayload {
  title: string;
  description: string;
  meta?: {
    limit?: number;
    [key: string]: unknown;
  };
}

export interface CreateFeatureResponse {
  message: string;
  status: "SUCCESS" | "FAILED" | string;
  data: Feature;
}

/* ---------- service ---------- */

class FeatureService extends ApiClient {
  constructor() {
    super("master-admin");
  }

  // Get all features
  async getFeatures(payload: {
    is_table_view: boolean;
    page: number;
    limit: number;
  }) {
    return this.post<FeaturesResponse>("/features/fetch", payload);
  }

  // Create new feature
  async createFeature(payload: CreateFeaturePayload) {
    return this.post<CreateFeatureResponse>(
      "/feature/create-manually",
      payload
    );
  }
}

/* singleton export */
export const featureService = new FeatureService();
