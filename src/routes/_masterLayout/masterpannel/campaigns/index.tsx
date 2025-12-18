import CampaignHeader from "@/features/campaign/components/CampaignHeader";
import CampaignTable from "@/features/campaign/components/CampaignTable";
import { useCampaigns } from "@/features/campaign/hooks/useCampaign";
import { createFileRoute } from "@tanstack/react-router";

import { useState } from "react";

export const Route = createFileRoute("/_masterLayout/masterpannel/campaigns/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { campaigns, pagination, isLoading } = useCampaigns(page, limit);

  // Filter campaigns based on search
  const filteredCampaigns =
    campaigns?.filter((campaign) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      return (
        campaign.title?.toLowerCase().includes(searchLower) ||
        campaign.type?.toLowerCase().includes(searchLower) ||
        campaign.message?.toLowerCase().includes(searchLower) ||
        campaign._id?.toLowerCase().includes(searchLower)
      );
    }) || [];

  console.log(campaigns);

  return (
    <div className="space-y-4 mt-10">
      <CampaignHeader search={search} setSearch={setSearch} />
      <CampaignTable
        campaigns={filteredCampaigns}
        page={page}
        setPage={setPage}
        limit={limit}
        pagination={pagination}
        isLoading={isLoading}
      />
    </div>
  );
}
