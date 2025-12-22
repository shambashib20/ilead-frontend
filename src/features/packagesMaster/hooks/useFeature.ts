import {
  queryOptions,
  // useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { featureService } from "../services/features.service";

export const fetchFeatures = async (payload: {
  is_table_view: boolean;
  page: number;
  limit: number;
}) => {
  const data = await featureService.getFeatures(payload);
  return data;
};

export const featuresQueryOptions = (payload: {
  is_table_view: boolean;
  page: number;
  limit: number;
}) =>
  queryOptions({
    queryKey: ["features"],
    queryFn: () => fetchFeatures(payload),
  });

export function useFeatures(payload: {
  is_table_view: boolean;
  page: number;
  limit: number;
}) {
  const { data, isLoading, isError, error } = useSuspenseQuery(
    featuresQueryOptions(payload)
  );

  console.log(data);

  return { features: data.data.data.items, isLoading, isError, error };
}
