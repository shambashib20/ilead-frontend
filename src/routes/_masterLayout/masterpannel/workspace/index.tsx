import WorkspaceMasterHeader from "@/features/workspaceMaster/components/WorkspaceMasterHeader";
import WorkspaceTable from "@/features/workspaceMaster/components/WorkspaceMasterTable";
import { useWorkspaces } from "@/features/workspaceMaster/hooks/useWorkspaceMaster";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_masterLayout/masterpannel/workspace/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit] = useState(1);

  const { properties, pagination, isLoading } = useWorkspaces(page, limit);

  // Filter workspaces based on search
  const filteredProperties =
    properties?.filter((property) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      return (
        property.name?.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower) ||
        property.status?.toLowerCase().includes(searchLower) ||
        property._id?.toLowerCase().includes(searchLower)
      );
    }) || [];

  console.log(properties);

  return (
    <div className="space-y-4 mt-10">
      <WorkspaceMasterHeader search={search} setSearch={setSearch} />
      <WorkspaceTable
        properties={filteredProperties}
        page={page}
        setPage={setPage}
        limit={limit}
        pagination={pagination}
        isLoading={isLoading}
      />
    </div>
  );
}
