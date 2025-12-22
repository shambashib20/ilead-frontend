import { ApiClient } from "@/services/ApiClient.service";

export interface StatsResponse {
    data: {
        server: string;
        dbStatus: string;
        cpuLoad: string;
        memory: {
            totalGB: string;
            usedGB: string;
            usagePercent: string;
        },
        paymentWebhookStatus: {
            success: boolean;
            message: string;
            webhookId: string;
            webhookUrl: string;
            events: string[];
        },
        card_statistics: {
            totalLeads: number;
            totalClients: number;
            totalCustomers: number;
            totalProperties: number;
            activeProperties: number;
        }
    };
}


class DashboardService extends ApiClient {
    constructor() {
        super("master-admin");
    }

    async masterFetchStats() {
        return this.get<StatsResponse>("/server/stats");
    }
}

export const dashboardService = new DashboardService();


