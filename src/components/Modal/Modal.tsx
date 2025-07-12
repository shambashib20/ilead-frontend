import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModalStore } from "@/store/useModalStore";

export function Modal() {
  const { isOpen, closeModal, modalContent } = useModalStore();
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader />
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}
