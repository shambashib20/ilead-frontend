import { useMutation } from "@tanstack/react-query";
import { labelService } from "../services/Label.service";
import { toast } from "sonner";
import { queryClient } from "@/utils/client";
import { useModalStore } from "@/store/useModalStore";
import { useNavigate } from "@tanstack/react-router";
import PaywallUi from "@/components/PaywallUi";
import { Button } from "@/components/ui/button";

export function useCreateLabel() {
  const { openModal, closeModal, setModalTitle, setModalSize } =
    useModalStore();
  const navigate = useNavigate();
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
          content: (
            <PaywallUi
              hint="Pro feature"
              message="Creating more than 3 labels requires the Pro plan."
              ctaLabel="Upgrade"
              secondaryLabel="Later"
              onUpgrade={() => {
                closeModal();
                navigate({
                  to: "/add-package",
                });
              }}
              onClose={closeModal}
            />
          ),
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
      toast.success("Label Created SucessFully");
    },
  });
  return { createLable: mutation.mutateAsync };
}
