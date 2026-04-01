import { ApiClient } from "@/services/ApiClient.service";

export interface GenerateApiKeyPayload {
  purpose: string;
  label_id: string;
  expiry_at: string; // ISO 8601 — e.g. "2026-09-30T00:00:00.000Z"
}

export interface GenerateApiKeyResponse {
  status: string;
  message: string;
  data: {
    api_key?: string;
    key?: string;
    expiry_at?: string;
    label_id?: string;
    purpose?: string;
    [key: string]: unknown;
  };
}

class PropertyApiKeyService extends ApiClient {
  constructor() {
    super("property");
  }

  async generateApiKey(
    payload: GenerateApiKeyPayload
  ): Promise<GenerateApiKeyResponse> {
    const response = await this.post<GenerateApiKeyResponse>(
      "/generate/api-key",
      payload
    );
    return response.data;
  }
}

export const propertyApiKeyService = new PropertyApiKeyService();
