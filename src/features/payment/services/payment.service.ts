import { ApiClient } from "@/services/ApiClient.service";

// src/features/payment/types/pricing.ts

export type PlanStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED" | string;

export interface FeatureLog {
  _id: string;
  title: string;
  description: string;
  status: PlanStatus;
  meta?: Record<string, unknown>;
  createdAt: string; // ISO
  updatedAt: string; // ISO
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
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface PlanLog {
  _id: string;
  title: string;
  description: string;
  status: PlanStatus;
  meta?: Record<string, unknown>;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface PricingPlan {
  _id: string;
  title: string;
  description: string;
  validity: string; // ISO date
  validity_in_days: number; // e.g. 7
  status: PlanStatus;
  price: number; // INR (assumed)
  features: PlanFeature[];
  createdBy: string | null;
  logs: PlanLog[];
  meta?: Record<string, unknown>;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface PricingPlansResponse {
  message: string; // "Pricing Plans fetched!"
  status: "SUCCESS" | "FAILED" | string;
  data: PricingPlan[];
}

class PaymentService extends ApiClient {
  constructor() {
    super("package"); // this.modulePath becomes /auth
  }

  async getPlans(): Promise<PricingPlansResponse> {
    const res = await this.get<PricingPlansResponse>("/pricing-plans");
    return res.data;
  }
}

/** 🔄 Export singleton for reuse */
export const paymentService = new PaymentService();
