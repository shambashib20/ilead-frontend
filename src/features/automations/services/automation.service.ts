import { ApiClient } from "@/services/ApiClient.service";

export class AutomationService extends ApiClient {
  constructor() {
    super("automtation");
  }

  async getAutomations() {}

  async createAutomation() {}
}

export const automationService = new AutomationService(); // singleton
