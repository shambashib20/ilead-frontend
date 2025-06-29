// src/api/ApiClient.ts

import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

/**
 * Base API Client Class using Axios
 */
export class ApiClient {
  private static readonly BASE_URL = "http://localhost:8000/api";
  protected axiosInstance: AxiosInstance;
  private readonly modulePath: string;

  protected constructor(modulePath: string) {
    this.modulePath = "/" + modulePath.replace(/^\/|\/$/g, ""); // remove leading/trailing slashes

    this.axiosInstance = axios.create({
      baseURL: ApiClient.BASE_URL,
      timeout: 5000,
      withCredentials: true, // 🧁 allow cookies to be sent
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Optional: interceptors for logging or auth token
    this.axiosInstance.interceptors.response.use(
      (response) => response, // automatic unwrap of data
      (error) => {
        console.error("API error:", error.response || error.message);
        return Promise.reject(error);
      }
    );
  }

  /** Join modulePath + endpoint (handles slashes) */
  private url(endpoint: string) {
    const ep = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.modulePath}${ep}`; // e.g. "/auth/login"
  }

  /* ---------- Thin HTTP methods wrappers ---------- */
  protected get<T>(endpoint: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get<T>(this.url(endpoint), config);
  }

  protected post<T>(endpoint: string, data: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post<T>(this.url(endpoint), data, config);
  }

  protected put<T>(endpoint: string, data: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.put<T>(this.url(endpoint), data, config);
  }

  protected delete<T>(endpoint: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete<T>(this.url(endpoint), config);
  }
}
