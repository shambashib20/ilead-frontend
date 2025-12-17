// src/services/Client.service.ts
import { ApiClient } from "@/services/ApiClient.service";

/* ---------- types ---------- */

export interface ClientListPayload {
  page: number;
  limit: number;
}

export interface ClientMeta {
  ray_id: string;
  login_session: {
    from_route: string;
    submitted_at: string;
    location: {
      country: string;
      region: string;
      city: string;
      ip: string;
    };
  };
}

export interface Client {
  _id: string;
  name: string;
  mobile_number: string;
  email: string;
  message: string;
  status: "new" | "contacted" | "closed" | string;
  meta: ClientMeta;
  createdAt: string;
  updatedAt: string;
}

/* ---------- service ---------- */

class ClientService extends ApiClient {
  constructor() {
    super("client");
  }

  getAllClients(payload: ClientListPayload) {
    return this.post<Client[]>("/all", payload);
  }
}

/* singleton export */
export const clientService = new ClientService();
