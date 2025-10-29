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

export interface PaymentResponse {
  message: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  data: {
    payment_link: string;
    payment_link_id: string;
    raw: {
      accept_partial: boolean;
      amount: number;
      amount_paid: number;
      cancelled_at: number;
      created_at: number;
      currency: string;
      customer: unknown[]; // looks like array, define properly if needed
      description: string;
      expire_by: number;
      expired_at: number;
      first_min_partial_amount: number;
      id: string;
      notes: {
        package_code: string | null;
        package_id: string;
        property_id: string;
        user_id: string;
      };
      notify: {
        email: boolean;
        sms: boolean;
        whatsapp: boolean;
      };
      payments: unknown | null;
      reference_id: string;
      reminder_enable: boolean;
      reminders: unknown[];
      short_url: string;
      status: string;
      updated_at: number;
      upi_link: boolean;
      user_id: string;
      whatsapp_link: boolean;
    };
    notes: {
      package_id: string;
      user_id: string;
      property_id: string;
      package_code: string | null;
    };
  };
}

class PaymentService extends ApiClient {
  constructor() {
    super("package"); // this.modulePath becomes /auth
  }

  async getPlans(): Promise<PricingPlansResponse> {
    const res = await this.get<PricingPlansResponse>("/pricing-plans");
    return res.data;
  }

  async startPayment({
    packageId,
  }: {
    packageId: string;
  }): Promise<PaymentResponse> {
    const res = await this.post<PaymentResponse>("/create-payment-link", {
      packageId,
    });
    return res.data;
  }
}

/** 🔄 Export singleton for reuse */
export const paymentService = new PaymentService();
