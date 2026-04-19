import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import { useDeleteAutomation } from "../../hooks/deleteAutomation";

// Self-contained content — handles its own confirm + cancel, no footer needed
function DeleteAutomationContent({ automationId }: { automationId: string }) {
  const popModal = useModalStore((s) => s.popModal);
  const { mutate, isPending } = useDeleteAutomation();

  const handleConfirm = () => {
    mutate(automationId, { onSuccess: () => popModal() });
  };

  return (
    <div className="space-y-5 px-5 py-6">
      <div className="flex flex-col items-center gap-3">
        <Trash2 className="text-red-500" size={44} strokeWidth={1.5} />
        <h3 className="text-base font-semibold">Delete Automation</h3>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Are you sure you want to delete this automation?
        <br />
        This action cannot be undone.
      </p>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Button
          variant="destructive"
          onClick={handleConfirm}
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Confirm Delete"}
        </Button>
        <Button variant="outline" onClick={popModal} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

type OpenModalFn = (params: {
  size?: "sm" | "md" | "lg" | "xl" | "normal";
  content: ReactNode;
}) => void;

export function openDeleteAutomationModal(
  automationId: string,
  openModal: OpenModalFn
) {
  openModal({
    size: "sm",
    content: <DeleteAutomationContent automationId={automationId} />,
  });
}
