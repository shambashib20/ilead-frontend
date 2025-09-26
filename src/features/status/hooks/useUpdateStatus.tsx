// hooks/useUpdateStatus.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/utils/client";
import { statusService } from "../services/Status.service";
import type {
  EditStatusPayload,
  EditStatusResponse,
} from "../services/Status.service";

/**
 * Usage:
 * const { updateStatus, isPending } = useUpdateStatus();
 * await updateStatus({ id, title, description, color, is_active });
 */
export function useUpdateStatus() {
  const mutation = useMutation<
    EditStatusResponse,
    unknown,
    {
      id: string;
      title?: string;
      description?: string;
      color?: string;
      is_active?: boolean;
    }
  >({
    mutationFn: async ({ id, title, description, color, is_active }) => {
      // build payload matching EditStatusPayload shape expected by service
      const payload: EditStatusPayload = {
        statusId: id,
        title: title ?? "",
        description: description ?? "",
        meta: {
          is_active: !!is_active,
          color_code: color ?? "",
        },
      };

      return statusService.editStatus(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["status"] });
      toast.success("Status updated successfully");
    },

    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to update status";
      toast.error(msg);
    },
  });

  return {
    updateStatus: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
