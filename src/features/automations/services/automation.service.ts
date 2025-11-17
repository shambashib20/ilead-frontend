// src/services/Automation.service.ts
import { ApiClient } from "@/services/ApiClient.service";

/* ------------------ Types ------------------ */

export interface AutomationRule {
  device_type: string;
  status_id: string;
  label_id: string;
  template_id: string;
  _id?: string;
}

export interface AutomationMeta {
  created_by?: string;
  trigger_source?: string;
  is_active?: boolean;
}

export interface Automation {
  _id: string;
  type: string; // "LEAD_AUTOMATION"
  lead_type: string; // "FIRST_MESSAGE"
  property_id: string;
  rules: AutomationRule[];
  meta: AutomationMeta;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AutomationListData {
  automations: Automation[];
  pagination: AutomationPagination;
}

export interface AutomationResponse {
  message: string;
  status: "SUCCESS" | "ERROR";
  data: AutomationListData;
}

export interface CreateAutomationPayload {
  type: string;
  lead_type: string;
  rules: AutomationRule[];
  meta: AutomationMeta;
}

/* ------------------ Service ------------------ */

export class AutomationService extends ApiClient {
  constructor() {
    super("automation");
  }

  async getAutomations(params: { page?: number; limit?: number } = {}) {
    // GET /automation/fetch?page=&limit=
    const res = await this.get<AutomationResponse>("/fetch", {
      params,
    });

    // return just the useful part: { automations, pagination }
    return res.data.data;
  }

  async createAutomation(payload: CreateAutomationPayload) {
    const res = await this.post<AutomationResponse>("/create", payload);
    return res.data;
  }
}

/* ------------------ Singleton ------------------ */

export const automationService = new AutomationService();
