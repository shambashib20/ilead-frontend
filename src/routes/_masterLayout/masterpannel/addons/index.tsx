import AddonHeader from "@/features/addons/components/AddonsHeader";
import AddonTable from "@/features/addons/components/AddonsTable";
import { useAddons } from "@/features/addons/hooks/useAddons";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_masterLayout/masterpannel/addons/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { addons, pagination, isLoading } = useAddons(page, limit);

  // Filter addons based on search
  const filteredAddons =
    addons?.filter((addon) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      return (
        addon.title?.toLowerCase().includes(searchLower) ||
        addon.description?.toLowerCase().includes(searchLower) ||
        addon.status?.toLowerCase().includes(searchLower) ||
        addon.value?.toString().includes(search) ||
        addon._id?.toLowerCase().includes(searchLower)
      );
    }) || [];

  console.log(addons);

  return (
    <div className="space-y-4 mt-10">
      <AddonHeader search={search} setSearch={setSearch} />
      <AddonTable
        addons={filteredAddons}
        page={page}
        setPage={setPage}
        limit={limit}
        pagination={pagination}
        isLoading={isLoading}
      />
    </div>
  );
}
