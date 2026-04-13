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

export interface ApiKey {
  title: string;
  description: string;
  value: string;
  created_at: string;
  expiry_at: string;
  purpose: string;
  status: string;
  label_id: string;
  usage_limit: number;
  usage_count: number;
  label: {
    _id: string;
    title: string;
    description: string;
    meta: {
      is_active: boolean;
      color_code: string;
      [key: string]: unknown;
    };
  };
}

export interface ApiKeysResponse {
  message: string;
  status: string;
  data: ApiKey[];
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

  async fetchApiKeys(): Promise<ApiKeysResponse> {
    const response = await this.get<ApiKeysResponse>("/api-keys");
    return response.data;
  }
}

export const propertyApiKeyService = new PropertyApiKeyService();
