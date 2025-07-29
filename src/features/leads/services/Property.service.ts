import { ApiClient } from "@/services/ApiClient.service";

interface Log {
  title: string;
  description: string;
  status: "INFO" | "WARNING" | "ERROR" | "ACTION" | "SYSTEM";
  createdAt: Date;

  meta?: Record<string, any>;
}

interface KeyAccess {
  key: string;
  name?: string;
  usage_limit: number;
  usage_count: number;
  allowed_users: string[];
  created_at: Date;
  expires_at?: Date;
  status: "ACTIVE" | "INACTIVE";
  meta?: Record<string, any>;
}

export type Property = {
  meta?: {
    [key: string]: any;
  };
  _id: string;
  name: string;
  description: string;
  usage_limits: number;
  usage_count: number;
  logs: Log[];
  role: {
    _id: string;
    name: string;
  };
  email_verification_otp: string;
  otp_expiration: Date | null;
  is_verified: boolean;
  reported: boolean;
  is_banned: boolean;
  status: "ACTIVE" | "INACTIVE" | "USAGE_LIMIT_EXCEEDED";
  keys: KeyAccess[];
};

export interface PropertyResponse {
  message: string;
  status: string;
  data: Property;
}

interface UpdateProperty {
  propId: string;
  name: string;
  description: string;
}

export interface UpdatePropertyResponse {
  message: string;
  status: string;
  data: Property;
}

export class PropertyModule extends ApiClient {
  constructor() {
    super("property");
  }

  async getProperty() {
    return this.get<PropertyResponse>("/workspace-details");
  }

  async updateProperty(payload: UpdateProperty) {
    return this.patch<UpdatePropertyResponse>("/update", payload);
  }
}

export const workspaceService = new PropertyModule();
