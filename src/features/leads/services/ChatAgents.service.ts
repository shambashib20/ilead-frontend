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

export interface Agent {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  createdAt: string;
  meta?: {
    is_active?: boolean;
  };
}

interface UpdateChatAgentResponse {
  message: string;
  statusCode: number;
  data: Agent;
}

export interface Pagination {
  total: number;
  limit: number;
  currentPage: number;
  totalPages: number;
}

interface PaginatedChatAgentsResponse {
  message: string;
  status: string;
  data: {
    chatAgents: Agent[];
    pagination: Pagination;
  };
}

class ChatAgentService extends ApiClient {
  constructor() {
    super("user");
  }

  async chatAgents() {
    return this.get<ChatAgentsResponse>("chat-agents/all");
  }

  async fetchPaginatedChatAgents(page = 1, limit = 10) {
    const query = `chat-agents/paginated?page=${page}&limit=${limit}`;
    return this.get<PaginatedChatAgentsResponse>(query);
  }

  async updateChatAgent(
    id: string,
    data: { name?: string; email?: string; phone_number?: string }
  ) {
    return this.patch<UpdateChatAgentResponse>(`chat-agents/${id}`, data);
  }

  async toggleActiveStatus(
    userId: string,
    isActive: boolean,
    reassignTo?: string
  ) {
    return this.patch<{ message: string; already_in_state?: boolean }>(
      "toggle-active",
      { userId, is_active: isActive, ...(reassignTo ? { reassign_to: reassignTo } : {}) }
    );
  }
}

export const chatAgentService = new ChatAgentService();
