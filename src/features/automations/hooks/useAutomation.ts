import { useSuspenseQuery } from "@tanstack/react-query";
import {
  automationService,
  type AutomationListData,
} from "../services/automation.service";

export const fetchAutomations = async (page = 1, limit = 10) => {
  return automationService.getAutomations({ page, limit });
};

export const automationsQueryOptions = (page = 1, limit = 10) => ({
  queryKey: ["automations", page, limit],
  queryFn: () => fetchAutomations(page, limit),
});

export function useAutomations(page = 1, limit = 10) {
  const { data, isLoading } = useSuspenseQuery<AutomationListData>(
    automationsQueryOptions(page, limit)
  );

  return {
    automations: data?.automations ?? [],
    pagination: data?.pagination,
    isLoading,
  };
}
