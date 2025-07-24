import { ApiClient } from "@/services/ApiClient.service";

export interface UserDto {
  meta?: {
    [key: string]: any;
  };
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  role: RoleDto;
  email_verification_otp: string;
  otp_expiration: Date | null;
  password: string;
  is_verified: boolean;
  reported: boolean;
  is_banned: boolean;
  property_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleDto {
  meta?: {
    [key: string]: any;
  };
  name: string;
  description?: string;
  permissions: string[];
}

export interface PermissionDto {
  meta?: {
    [key: string]: any;
  };
  name: string;
  description: string;
}

export interface UserResponse {
  message: string;
  status: string;
  data: UserDto;
}

export class UserModule extends ApiClient {
  constructor() {
    super("user");
  }

  async getUserDetails() {
    return this.get<UserResponse>("/profile-info");
  }
}

export const userService = new UserModule();
