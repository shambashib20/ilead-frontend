import {
  queryOptions,
  // useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { paymentService } from "../services/payment.service";

export const fetchPlans = async () => {
  const data = await paymentService.getPlans();
  return data;
};

export const pricingPlansQueryOptions = () =>
  queryOptions({
    queryKey: ["plans"],
    queryFn: () => fetchPlans(),
  });

export function usePricingPlans() {
  const { data, isLoading, isError, error } = useSuspenseQuery(
    pricingPlansQueryOptions()
  );
  return { pricingPlans: data.data, isLoading, isError, error };
}
