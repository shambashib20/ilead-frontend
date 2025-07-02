import { ApiClient } from "@/services/ApiClient.service";

/* ---------- Payload Types ---------- */
interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
}

/* ---------- Common User Type ---------- */
interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

/* ---------- Unified API Response ---------- */
interface AuthResponse {
  message: string;
  status: string;
  data: {
    user: User;
  };
}

/* ---------- /me Response Type ---------- */
// interface MeResponse {
//   id: string;
//   email: string;
// }

/**
 * 🔐 Auth API Service (auto-prefixes with `/auth`)
 */
class AuthService extends ApiClient {
  constructor() {
    super("auth"); // this.modulePath becomes /auth
  }

  login(payload: LoginPayload): Promise<AuthResponse> {
    return this.post<AuthResponse>("/login", payload).then((res) => res.data);
  }

  register(payload: RegisterPayload): Promise<AuthResponse> {
    return this.post<AuthResponse>("/register", payload).then(
      (res) => res.data
    );
  }

  //   me(): Promise<MeResponse> {
  //     return this.get<MeResponse>("/me");
  //   }
}

/** 🔄 Export singleton for reuse */
export const authService = new AuthService();
