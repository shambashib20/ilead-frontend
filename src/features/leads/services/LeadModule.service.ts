import { ApiClient } from "@/services/ApiClient.service";

interface DeleteLeadsResponse {
  message: string;
  status: string;
}
class LeadsModuleService extends ApiClient {
  constructor() {
    super("lead");
  }

  // rename to reflect “search”
  async deleteLeads({
    rayId,
    deleteReason,
  }: {
    rayId: string;
    deleteReason: string;
  }): Promise<DeleteLeadsResponse> {
    const response = await this.patch<DeleteLeadsResponse>("/delete-lead", {
      rayId,
      deleteReason,
    });
    return response.data;
  }
}

export const leadsModuleService = new LeadsModuleService();
