import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { campaignService, type Campaign } from "../services/campaign.service";

/* ---------- fetcher ---------- */

export const fetchCampaigns = async (page: number, limit: number) => {
  const res = await campaignService.getAllCampaigns(page, limit);
  return res;
};

/* ---------- query options ---------- */

export const campaignsQueryOptions = (page: number = 1, limit: number = 10) =>
  queryOptions({
    queryKey:
      page === 1 && limit === 10 ? ["campaigns"] : ["campaigns", page, limit],
    queryFn: () => fetchCampaigns(page, limit),
  });

/* ---------- hook ---------- */

export function useCampaigns(page: number = 1, limit: number = 10) {
  const { data, isLoading } = useSuspenseQuery(
    campaignsQueryOptions(page, limit)
  );

  console.log("Hook data:", data);

  return {
    campaigns: data.data.data.campaigns as Campaign[],
    pagination: data.data.data.pagination,
    isLoading,
  };
}
