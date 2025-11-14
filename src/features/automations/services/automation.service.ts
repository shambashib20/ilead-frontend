// src/services/Automation.service.ts
import { ApiClient } from "@/services/ApiClient.service";

/* ------------------ Types ------------------ */

export interface AutomationRule {
  device_type: string;
  status_id: string;
  label_id: string;
  template_id: string;
}

export interface AutomationMeta {
  created_by: string;
  trigger_source: string;
}

export interface CreateAutomationPayload {
  type: string; // "LEAD_AUTOMATION"
  lead_type: string; // "FIRST_MESSAGE"
  rules: AutomationRule[];
  meta: AutomationMeta;
}

export interface AutomationResponse {
  message: string;
  status: "SUCCESS" | "ERROR";
  data: any; // You said you don't need typed response now
}

/* ------------------ Service ------------------ */

export class AutomationService extends ApiClient {
  constructor() {
    super("automation");
  }

  async getAutomations() {
    // GET /automation
    const res = await this.get<AutomationResponse>("/");
    return res.data;
  }

  async createAutomation(payload: CreateAutomationPayload) {
    // POST /automation/create
    const res = await this.post<AutomationResponse>("/create", payload);
    return res.data;
  }
}

/* ------------------ Singleton ------------------ */

export const automationService = new AutomationService();
