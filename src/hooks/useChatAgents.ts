import { chatAgentService } from "@/features/leads/services/ChatAgents.service";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const AgentsQueryOptions = () =>
  queryOptions({
    queryKey: ["agents"],
    queryFn: () => chatAgentService.chatAgents(),
  });

export function useChatAgents() {
  const { data, isLoading } = useSuspenseQuery(AgentsQueryOptions());
  return { agents: data.data, isLoading };
}
