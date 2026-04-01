import { ApiClient } from "@/services/ApiClient.service";
import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL as string).replace(/\/+$/, "");
const API_KEY = import.meta.env.VITE_LEAD_SUBMISSION_API_KEY as string;

export interface MarketingLeadPayload {
  name: string;
  phone_number: string;
  email: string;
  address: string;
  comment: string;
}

interface MarketingLeadResponse {
  status: string;
  message: string;
}

class LeadSubmissionService extends ApiClient {
  constructor() {
    super("lead");
  }

  // Uses raw axios instead of this.post() — this endpoint authenticates via
  // Basic auth (API key), not cookies. Bypassing the ApiClient interceptors
  // prevents the 401→fireLogoutOnce side-effect for public page visitors.
  // Same pattern as WapmonkeyService.getWapmonkeyApiCount().
  async submitMarketingLead(
    payload: MarketingLeadPayload
  ): Promise<MarketingLeadResponse> {
    const res = await axios.post<MarketingLeadResponse>(
      `${API_BASE}/api/lead/create/via-label`,
      {
        label_title: "ETC Landing Page Lead",
        company_name: "",
        reference: "Direct Website Lead",
        ...payload,
      },
      {
        headers: {
          Authorization: `Basic ${btoa(`${API_KEY}:`)}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
}

export const leadSubmissionService = new LeadSubmissionService();
