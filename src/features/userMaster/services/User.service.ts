import { ApiClient } from "@/services/ApiClient.service";

/* ---------- types ---------- */

export interface UserListPayload {
  page: number;
  limit: number;
}

export interface User {
  name: string;
  email: string;
  phone_number: string;
  user_id: string;
  role: string;
}

export interface Workspace {
  property_id: string;
  property_name: string;
  totalUsers: number;
  users: User[];
}

export interface UserPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UserResponse {
  data: {
    workspaces: Workspace[];
    pagination: UserPagination;
  };
}

/* ---------- service ---------- */

class UserService extends ApiClient {
  constructor() {
    super("master-admin");
  }

  getAllUsersWithRoles(page: number = 1, limit: number = 12) {
    return this.get<UserResponse>(
      `/users-with-roles/fetch?page=${page}&limit=${limit}`
    );
  }
}

/* singleton export */
export const userService = new UserService();
