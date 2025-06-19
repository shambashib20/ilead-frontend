import { ApiClient } from "@/services/ApiClient.service";

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    email: string;
    password: string;
}

interface AuthResponse {
    message: string;
    status: string;
    data: {
        user: {
            _id: string;
            email: string;
            name: string;
            role: string;
        }

    };
}
interface LoginResponse {
    message: string;
    status: string;
    data: {
        user: {
            _id: string;
            email: string;
            name: string;
            role: string;
        }

    };
}

/**
 * Service for auth routes (auto-prefixes with /auth)
 */
class AuthService extends ApiClient {
    constructor() {
        super('auth');
    }

    async login(payload: LoginPayload): Promise<LoginResponse> {
        return this.post<AuthResponse>('/login', payload);
    }

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        return this.post<AuthResponse>('/register', payload);
    }

    async me(): Promise<{ id: string; email: string }> {
        return this.get('/me');
    }
}

export const authService = new AuthService(); // singleton
