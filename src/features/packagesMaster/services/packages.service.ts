import { ApiClient } from "@/services/ApiClient.service";

/* ---------- types ---------- */

export type PlanStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED" | string;

export interface FeatureLog {
  _id: string;
  title: string;
  description: string;
  status: PlanStatus;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFeatureMeta {
  package_id: string;
  limit?: number;
  [key: string]: unknown;
}

export interface PlanFeature {
  _id: string;
  title: string;
  description: string;
  status: PlanStatus;
  logs: FeatureLog[];
  meta: PlanFeatureMeta;
  createdAt: string;
  updatedAt: string;
}

export interface PlanLog {
  _id: string;
  title: string;
  description: string;
  status: PlanStatus;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlan {
  _id: string;
  title: string;
  description: string;
  validity: string;
  validity_in_days: number;
  status: PlanStatus;
  price: number;
  features: PlanFeature[];
  createdBy: string | null;
  logs: PlanLog[];
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlansResponse {
  message: string;
  status: "SUCCESS" | "FAILED" | string;
  data: PricingPlan[];
}

export interface CreatePackagePayload {
  title: string;
  description: string;
  validity: string; // ISO date format: "2026-02-12T00:00:00.000Z"
  validity_in_days: string;
  price: string;
  features: string[]; // Array of feature IDs
  status: PlanStatus;
  meta?: {
    package_code?: string;
    [key: string]: unknown;
  };
}

export interface CreatePackageResponse {
  message: string;
  status: "SUCCESS" | "FAILED" | string;
  data: PricingPlan;
}
export interface UpdatePackagePayload {
  packageId: string;
  title: string;
  description: string;
  validity: string; // ISO date format: "2026-02-12T00:00:00.000Z"
  validity_in_days: string;
  price: string;
  features: string[]; // Array of feature IDs
  status: PlanStatus;
  meta?: {
    package_code?: string;
    [key: string]: unknown;
  };
}
export interface UpdatePackageResponse {
  message: string;
  status: "SUCCESS" | "FAILED" | string;
  data: PricingPlan;
}

/* ---------- service ---------- */

class PackageService extends ApiClient {
  constructor() {
    super("master-admin");
  }

  // Get all packages
  async getPackages() {
    return this.get<PricingPlansResponse>("/pricing-plans");
  }

  // Create new package
  async createPackage(payload: CreatePackagePayload) {
    return this.post<CreatePackageResponse>(
      "/package/create-manually",
      payload
    );
  }

  async updatePackage(payload: UpdatePackagePayload) {
    return this.patch<UpdatePackageResponse>(
      "/package/update-manually",
      payload
    );
  }
}

/* singleton export */
export const packageService = new PackageService();
