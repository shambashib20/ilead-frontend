import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  templateService,
  type UpdateTemplatePayload,
} from "../service/template.service";
import { templateByIdQueryKey } from "./useGetTemplate";

export function useUpdateTemplate() {
  const qc = useQueryClient();

  return useMutation<any, unknown, { id: string; payload: UpdateTemplatePayload }>({
    mutationFn: ({ id, payload }) => templateService.updateTemplate(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      qc.invalidateQueries({ queryKey: templateByIdQueryKey(id) });
      toast.success("Template updated successfully!");
    },
    onError: (err: unknown) => {
      console.error("Update template failed:", err);
      toast.error("Failed to update template");
    },
  });
}
