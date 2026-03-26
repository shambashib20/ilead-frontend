"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { useModalStore } from "@/store/useModalStore";
import { Button } from "../ui/button";

const MODAL_SIZE = {
  sm: "w-[400px]",
  normal: "w-[700px]",
  md: "w-[800px]",
  lg: "w-[1000px]",
  xl: "w-[1200px]",
};

export function Modal() {
  const { isOpen, stack, closeModal, popModal } = useModalStore();

  // Top of stack = current modal
  const current = stack[stack.length - 1];

  if (!current) return null;

  const {
    content,
    title,
    type = "info",
    customActions,
    formActions,
    size = "normal",
    submitLabel,
  } = current;

  const handleSubmit = () => {
    if (formActions?.onSubmit) {
      formActions.onSubmit();
    }
  };

 const handleCancel = () => {
   formActions?.onCancel?.(); // sirf side effects (form reset)
   popModal(); // 👈 always pop — yahi close karega
 };
  const showFooter = type === "form" || type === "action" || customActions;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className={`${MODAL_SIZE[size] ?? "w-[700px]"}`}>
        {title ? (
          <DialogHeader className="bg-[#2a47a7] text-white">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        ) : (
          <VisuallyHidden>
            <DialogTitle>Modal</DialogTitle> {/* 👈 hidden but accessible */}
          </VisuallyHidden>
        )}

        <div className="px-0 py-0">{content}</div>

        {(title || showFooter) && (
          <DialogFooter>
            <div className="flex items-center justify-end gap-2 border-t border-gray-600 w-full py-4 px-5">
              {/* Custom actions */}
              {customActions && customActions}

              {/* Form actions */}
              {type === "form" && !customActions && (
                <>
                  <Button
                    className="text-white bg-blue-600 hover:bg-blue-700"
                    onClick={handleSubmit}
                    disabled={
                      !formActions?.canSubmit || formActions?.isSubmitting
                    }
                  >
                    {formActions?.isSubmitting
                      ? `${submitLabel || "Submit"}...`
                      : submitLabel || "Submit"}
                  </Button>
                  <Button
                    className="bg-gray-500 hover:bg-gray-600"
                    onClick={handleCancel}
                    disabled={formActions?.isSubmitting}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {/* Action modal */}
              {type === "action" && !customActions && (
                <Button onClick={popModal}>Close</Button> // 👈 popModal
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
