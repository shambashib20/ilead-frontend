// src/api/ApiClient.ts

import { createAlova, } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';

/**
 * Base API Client Class
 */
export class ApiClient {
    private static readonly BASE_URL = 'http://localhost:8000/api';
    protected alova;
    private readonly modulePath: string;


    protected constructor(modulePath: string) {
        this.modulePath = '/' + modulePath.replace(/^\/|\/$/g, '');
        this.alova = createAlova({
            baseURL: ApiClient.BASE_URL,
            timeout: 5000, // 5 sec timeout
            requestAdapter: adapterFetch(),
            statesHook: ReactHook, // for React integration (e.g., useRequest)


            responded: {
                /** Every 2xx lands here → JSON parse & return */
                onSuccess: async (res /* Response */) => {
                    const json = await res.json();
                    return json;                 // ← THIS hits your React-Query `data`
                },

                /** Handle non-2xx quickly */
                onError: async (err, _method) => {
                    console.error('API error:', err);
                    throw err;                   // propagate
                }
            }
        });


    }

    /** Join modulePath + endpoint (handles slashes) */
    private url(endpoint: string) {
        const ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.modulePath}${ep}`;       // e.g. "/auth/login"
    }

    /* ---------- thin wrappers ---------- */
    protected get<T>(endpoint: string, config?: any) {
        return this.alova.Get<T>(this.url(endpoint), config);
    }

    protected post<T>(endpoint: string, data: any, config?: any) {
        return this.alova.Post<T>(this.url(endpoint), data, config);
    }

    protected put<T>(endpoint: string, data: any, config?: any) {
        return this.alova.Put<T>(this.url(endpoint), data, config);
    }

    protected delete<T>(endpoint: string, config?: any) {
        return this.alova.Delete<T>(this.url(endpoint), config);
    }
}
