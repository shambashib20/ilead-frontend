import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { queryClient } from "@/utils/client";
import { statusService } from "../services/Status.service";

export function useCreateStatus() {
  const mutation = useMutation({
    mutationFn: ({
      title,
      description,
      color,
    }: {
      title: string;
      description: string;
      color: string;
    }) => {
      console.log(title, description, color);
      return statusService.createStatus({
        title,
        description,
        color_code: color,
      });
    },

    // onMutate: (variables) => {},
    onError: (error: unknown) => {
      console.error("Create Status failed:", error);

      let message = "Something went wrong while creating the Status.";

      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = String((error as any).message);
      }

      toast.error(message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Status Created SucessFully");
    },
  });
  return { createStatus: mutation.mutate, isPending: mutation.isPending };
}
