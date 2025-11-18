// src/services/ApiClient.service.ts
import { fireLogoutOnce } from "@/lib/utils";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosError,
} from "axios";

// type ApiStatus = "success" | "error";

export interface NormalizedApiError {
  status: number;
  code?: string;
  message: string;
  details?: unknown;
  requestId?: string;
  url?: string;
  method?: string;
}

const envBase = import.meta.env.VITE_API_URL as string;
if (!envBase) {
  // Fail loudly during dev – you'll thank yourself later.
  console.error("VITE_API_URL is missing");
}
const normalizeBase = (u: string) => u.replace(/\/+$/, "");
const API_BASE = normalizeBase(envBase) + "/api";

// Hard logout and offline destinations (tweak for your app routes)
const OFFLINE_ROUTE = "/offline"; // a simple page telling user they're offline

// Global guard to prevent redirect storms
let isLoggingOut = false;
let isOfflineRouting = false;

// Simple utilities
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isGet = (method?: string) => (method || "get").toLowerCase() === "get";

// Compute retry delay (exponential backoff + jitter), or use Retry-After if present
function computeRetryDelay(attempt: number, retryAfterHeader?: string): number {
  if (retryAfterHeader) {
    const sec = Number(retryAfterHeader);
    if (!Number.isNaN(sec) && sec >= 0) return Math.min(sec * 1000, 15000);
  }
  const base = Math.min(1000 * 2 ** attempt, 8000);
  const jitter = Math.random() * 250;
  return base + jitter;
}

export class ApiClient {
  private static readonly BASE_URL = API_BASE;
  protected axiosInstance: AxiosInstance;
  private readonly modulePath: string;

  protected constructor(modulePath: string) {
    // sanitize module path to a single leading slash, no trailing slash
    this.modulePath = "/" + modulePath.replace(/^\/|\/$/g, "");

    this.axiosInstance = axios.create({
      baseURL: ApiClient.BASE_URL,
      withCredentials: true,
      timeout: 15000, // 15s – better UX than hanging forever
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // REQUEST INTERCEPTOR
    // this.axiosInstance.interceptors.request.use((config) => {
    //   // Add a lightweight request id for debugging across logs
    //   const reqId =
    //     (crypto?.randomUUID && crypto.randomUUID()) ||
    //     Math.random().toString(36).slice(2);
    //   (config.headers ||= {})["X-Request-ID"] = reqId;

    //   // If sending FormData, let the browser set correct boundaries
    //   if (
    //     config.data instanceof FormData &&
    //     config.headers["Content-Type"] === "application/json"
    //   ) {
    //     delete config.headers["Content-Type"];
    //   }
    //   // Track on config for error normalization
    //   (config as any)._requestId = reqId;
    //   (config as any)._retryCount = (config as any)._retryCount ?? 0;
    //   return config;
    // });

    // RESPONSE INTERCEPTOR (success): unwrap data
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<any>) => {
        // No response => timeout, DNS fail, CORS block, network down, etc.
        if (!error.response) {
          const code = error.code;

          const isTimeout = code === "ECONNABORTED" || code === "ETIMEDOUT";

          if (!isTimeout) {
            // Network down or unreachable server
            if (!isOfflineRouting) {
              isOfflineRouting = true;
              try {
                await sleep(50);
              } finally {
                window.location.href = OFFLINE_ROUTE;
              }
            }
          }

          return Promise.reject(
            normalizeError(
              error,
              isTimeout ? "TIMEOUT" : undefined,
              (error.config as any)?._requestId
            )
          );
        }

        const { status, headers, config } = error.response;
        const requestId = (config as any)?._requestId;

        // 401 Unauthorized → logout
        if (status === 401) {
          if (!isLoggingOut) {
            isLoggingOut = true;
            try {
              fireLogoutOnce();
            } finally {
            }
          }
          return Promise.reject(
            normalizeError(error, "TOKEN_EXPIRED", requestId)
          );
        }

        // 403 Forbidden
        if (status === 403) {
          return Promise.reject(normalizeError(error, "FORBIDDEN", requestId));
        }

        // 429 Too many requests (GET only) → retry
        if (status === 429 && isGet(config?.method)) {
          const attempt = ((config as any)._retryCount ?? 0) + 1;
          if (attempt <= 2) {
            (config as any)._retryCount = attempt;
            const delay = computeRetryDelay(
              attempt,
              headers?.["retry-after"] as string
            );
            await sleep(delay);
            return this.axiosInstance.request(config);
          }
        }

        // Retry transient server errors for GET
        if (
          isGet(config?.method) &&
          (status === 502 || status === 503 || status === 504)
        ) {
          const attempt = ((config as any)._retryCount ?? 0) + 1;
          if (attempt <= 2) {
            (config as any)._retryCount = attempt;
            const delay = computeRetryDelay(attempt);
            await sleep(delay);
            return this.axiosInstance.request(config);
          }
        }

        // Final normalized rejection
        return Promise.reject(normalizeError(error, undefined, requestId));
      }
    );
  }

  private url(endpoint: string) {
    const ep = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.modulePath}${ep}`;
  }

  /* ---------- Thin HTTP method wrappers (return unwrapped data) ---------- */
  protected get<T>(endpoint: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get<T>(this.url(endpoint), config);
  }

  protected post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.post<T>(this.url(endpoint), data, config);
  }

  protected put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.axiosInstance.put<T>(this.url(endpoint), data, config);
  }

  protected patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.patch<T>(this.url(endpoint), data, config);
  }

  protected delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig & { data?: any }
  ) {
    // Axios supports a body on DELETE via config.data
    return this.axiosInstance.delete<T>(this.url(endpoint), config);
  }
}

/* ---------- helpers ---------- */
function normalizeError(
  error: AxiosError<any>,
  forcedCode?: string,
  requestId?: string
): NormalizedApiError {
  const status = error.response?.status ?? 0;
  const data = error.response?.data as any;
  const code =
    forcedCode ||
    data?.code ||
    (error.code === "ERR_NETWORK" ? "NETWORK_ERROR" : undefined);
  const message =
    data?.message ||
    error.message ||
    (status ? `HTTP ${status}` : "Network error");

  return {
    status,
    code,
    message,
    details: data?.details,
    requestId,
    url: error.config?.url,
    method: (error.config?.method || "GET").toUpperCase(),
  };
}
