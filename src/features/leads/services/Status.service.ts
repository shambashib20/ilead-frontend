import { ApiClient } from "@/services/ApiClient.service";

interface Lables {
  _id: string;
  description: string;
  title: string;
  meta: { is_active: boolean };
}

interface LableResponse {
  message: string;
  status: string;
  data: Lables[];
}

interface Status {
  _id: string;
  description: string;
  title: string;
  property_id: string;
  meta: { is_active: boolean };
}

interface StatusResponse {
  message: string;
  status: string;
  data: Status[];
}

/**
 * Service for auth routes (auto-prefixes with /auth)
 */
class StatusService extends ApiClient {
  constructor() {
    super("status");
  }

  async status() {
    return this.get<StatusResponse>("all");
  }

  //   async register(payload: RegisterPayload): Promise<AuthResponse> {
  //     return this.post<AuthResponse>("/register", payload);
  //   }

  //   async me(): Promise<{ id: string; email: string }> {
  //     return this.get("/me");
  //   }
}

export const statusService = new StatusService(); // singleton
