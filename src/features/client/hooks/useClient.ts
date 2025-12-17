// src/hooks/useClient.ts
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  clientService,
  type Client,
  type ClientListPayload,
} from "../service/Client.service";

/* ---------- fetcher ---------- */

export const fetchClients = async (payload: ClientListPayload) => {
  const res = await clientService.getAllClients(payload);
  return res;
};

/* ---------- query options ---------- */

export const clientsQueryOptions = (page: number = 1, limit: number = 10) =>
  queryOptions({
    queryKey:
      page === 1 && limit === 10 ? ["clients"] : ["clients", page, limit],

    queryFn: () =>
      fetchClients({
        page,
        limit,
      }),
  });

/* ---------- hook ---------- */

export function useClients(page: number = 1, limit: number = 10) {
  const { data, isLoading } = useSuspenseQuery(
    clientsQueryOptions(page, limit)
  );
  console.log(data);
  return {
    clients: data.data.clients as Client[],
    pagination: data.data?.pagination, // agar backend meta bhejta ho
    isLoading,
  };
}
