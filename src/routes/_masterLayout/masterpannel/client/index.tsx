import ClientHeader from "@/features/client/components/clientHeader";
import ClientTable from "@/features/client/components/clientTable";
import {
  clientsQueryOptions,
  useClients,
} from "@/features/client/hooks/useClient";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_masterLayout/masterpannel/client/")({
  component: RouteComponent,
  loader: (opts) => {
    opts.context.queryClient.ensureQueryData(clientsQueryOptions());
  },
});

function RouteComponent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const { clients, pagination, isLoading } = useClients(page, limit);

  const filteredClients =
    clients?.filter((client: any) => {
      if (!search) return true;

      const searchLower = search.toLowerCase();
      return (
        client.name?.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.mobile_number?.includes(search) ||
        client.status?.toLowerCase().includes(searchLower)
      );
    }) || [];

    
  return (
    <div className="space-y-4 mt-10">
      <ClientHeader search={search} setSearch={setSearch} />
      <ClientTable
        clients={filteredClients}
        page={page}
        setPage={setPage}
        limit={limit}
        pagination={pagination}
        isLoading={isLoading}
      />
    </div>
  );
}
