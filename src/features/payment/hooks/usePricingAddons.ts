import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  addonsService,
  type AddonPlansResponse,
} from "../services/addons.service";

/** 🔄 Fetch Addons */
export const fetchAddons = async (): Promise<AddonPlansResponse> => {
  const data = await addonsService.getAddonPlans();
  return data;
};

/** ⚙️ Query Options */
export const pricingAddonsQueryOptions = () =>
  queryOptions({
    queryKey: ["addons"],
    queryFn: () => fetchAddons(),
  });

/** 🎣 Custom Hook */
export function usePricingAddons() {
  const { data, isLoading, isError, error } = useSuspenseQuery(
    pricingAddonsQueryOptions()
  );

  return {
    pricingAddons: data?.data?.addons || [],
    pagination: data?.data?.pagination,
    isLoading,
    isError,
    error,
  };
}
