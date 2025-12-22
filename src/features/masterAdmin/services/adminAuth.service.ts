// src/services/AdminAuth.service.ts

import { ApiClient } from "@/services/ApiClient.service";

interface AdminLoginPayload {
  email: string;
  password: string;
}

interface AdminLoginResponse {
  data: {
    user: {
      email: string;
      name: string;
      phone_number: string;
      property_id: string;
      role: string;
      _id: string;
    };
  };
  message: string;
  status: string;
}





class AdminAuthService extends ApiClient {
  constructor() {
    super("auth");
  }

  adminLogin(payload: AdminLoginPayload) {
    return this.post<AdminLoginResponse>("/login", payload);
  }
}

// singleton export, kyunki tum har jagah naya instance bana ke circus nahi chala rahe
export const adminAuthService = new AdminAuthService();
