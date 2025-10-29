import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { queryClient } from "@/utils/client";
import { statusService } from "../services/Status.service";
import { useModalStore } from "@/store/useModalStore";
import PaywallUi from "@/components/PaywallUi";
import { Button } from "@/components/ui/button";

export function useCreateStatus() {
  const { openModal, closeModal, setModalTitle, setModalSize } =
    useModalStore();
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
    onError: (error: {
      response: { status: number; data: { message: string } };
    }) => {
      console.error("Create label failed:", error);
      const code = error?.response?.status;
      let message = "Something went wrong while creating the label.";
      const isPaywall = code === 403;

      if (isPaywall) {
        setModalTitle?.("Upgrade required");
        setModalSize?.("lg");

        openModal({
          type: "action",
          content: <PaywallUi />,
          customActions: (
            <>
              <Button variant="outline" onClick={closeModal}>
                Not now
              </Button>
              <Button>See plans</Button>
            </>
          ),
        });
        return;
      }
      setModalTitle?.("Something went wrong");
      setModalSize?.("sm");
      openModal({
        type: "action",
        content: (
          <div className="p-2">
            <p className="text-sm opacity-80">{message}</p>
          </div>
        ),
        customActions: <Button onClick={closeModal}>Close</Button>,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Status Created SucessFully");
    },
  });
  return { createStatus: mutation.mutate, isPending: mutation.isPending };
}
