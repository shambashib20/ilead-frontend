import { useSuspenseQuery } from "@tanstack/react-query";
import { templateService } from "../service/template.service";

export const fetchCampaigns = async (page = 1, limit = 10) => {
  return templateService.getCampaigns({ page, limit });
};

export const campaignQueryOptions = (page = 1, limit = 10) => ({
  queryKey: ["campaigns", page, limit],
  queryFn: () => fetchCampaigns(page, limit),
});

export function useCampaigns(page = 1, limit = 10) {
  const { data, isLoading } = useSuspenseQuery(campaignQueryOptions(page, limit));

  console.log(data);
  
  return {
    campaigns: data?.campaigns ?? [],
    pagination: data?.pagination,
    isLoading,
  };
}
