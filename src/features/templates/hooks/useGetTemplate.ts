import { useQuery } from "@tanstack/react-query";
import { templateService } from "../service/template.service";

export const templateByIdQueryKey = (id: string) => ["template", id] as const;

export function useGetTemplate(id: string | null) {
  return useQuery({
    queryKey: templateByIdQueryKey(id ?? ""),
    queryFn: () => templateService.getTemplateById(id!),
    enabled: !!id,
  });
}
