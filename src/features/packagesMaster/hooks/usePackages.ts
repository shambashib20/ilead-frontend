import { paymentService } from "@/features/payment/services/payment.service";
import {
  queryOptions,
  // useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const fetchPackages = async () => {
  const data = await paymentService.getPlans();
  return data;
};

export const packagesQueryOptions = () =>
  queryOptions({
    queryKey: ["packages"],
    queryFn: () => fetchPackages(),
  });

export function usePackages() {
  const { data, isLoading, isError, error } = useSuspenseQuery(
    packagesQueryOptions()
  );
  return { packages: data.data, isLoading, isError, error };
}
