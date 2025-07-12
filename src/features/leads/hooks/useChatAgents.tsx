import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { chatAgentService } from "../services/ChatAgents.service";

export const AgentsQueryOptions = () =>
  queryOptions({
    queryKey: ["agents"],
    queryFn: () => chatAgentService.chatAgents(),
  });

export function useChatAgents() {
  const { data, isLoading } = useSuspenseQuery(AgentsQueryOptions());
  return { agents: data.data, isLoading };
}
