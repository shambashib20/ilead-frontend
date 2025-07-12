import { ApiClient } from "@/services/ApiClient.service";

export interface Agents {
  _id: string;
  name: string;
}

interface ChatAgentsResponse {
  message: string;
  status: string;
  data: Agents[];
}

class ChatAgentService extends ApiClient {
  constructor() {
    super("user");
  }

  async chatAgents() {
    return this.get<ChatAgentsResponse>("chat-agents/all");
  }
}

export const chatAgentService = new ChatAgentService();
