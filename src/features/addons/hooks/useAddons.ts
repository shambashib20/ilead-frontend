// =====================================================
// src/hooks/useAddon.ts
// =====================================================

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { addonService } from "../services/addons.services";

/* ---------- fetcher ---------- */

export const fetchAddons = async (page: number, limit: number) => {
  const res = await addonService.getAllAddons(page, limit);
  return res;
};

/* ---------- query options ---------- */

export const addonsQueryOptions = (page: number = 1, limit: number = 10) =>
  queryOptions({
    queryKey: page === 1 && limit === 10 ? ["addons"] : ["addons", page, limit],
    queryFn: () => fetchAddons(page, limit),
  });

/* ---------- hook ---------- */

export function useAddons(page: number = 1, limit: number = 10) {
  const { data, isLoading } = useSuspenseQuery(addonsQueryOptions(page, limit));

  console.log("Hook data:", data);

  return {
    addons: data.data.data.addons,
    pagination: data.data.data.pagination,
    isLoading,
  };
}
