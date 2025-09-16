import { useMutation } from "@tanstack/react-query";
import { labelService } from "../services/Label.service";
import { toast } from "sonner";
import { queryClient } from "@/utils/client";

export function useCreateLabel() {
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
      return labelService.createLabel({
        title,
        description,
        color_code: color,
      });
    },

    // onMutate: (variables) => {},
    onError: (error: unknown) => {
      console.error("Create label failed:", error);

      let message = "Something went wrong while creating the label.";

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
      toast.success("Label Created SucessFully");
    },
  });
  return { createLable: mutation.mutate };
}
