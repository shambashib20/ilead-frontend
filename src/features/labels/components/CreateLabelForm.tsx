import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Swal from "sweetalert2";
import {
  labelService,
  type Lables,
} from "@/features/leads/services/Lable.service";
import { useCallback, useEffect, useState } from "react";
import { useModalStore } from "@/store/useModalStore";

interface CreateLabelFormProps {
  labelToEdit?: Lables;
  onSuccess?: () => void;
}

function CreateLabelForm({ labelToEdit, onSuccess }: CreateLabelFormProps) {
  const [title, setTitle] = useState(labelToEdit?.title || "");
  const [description, setDescription] = useState(
    labelToEdit?.description || ""
  );
  const isEditing = !!labelToEdit;
  const [submitting, setSubmitting] = useState(false);

  const { closeModal, setFormActions } = useModalStore();
  const canSubmit = title.trim() !== "";

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setSubmitting(true);
      try {
        if (isEditing) {
          await labelService.editLabel(labelToEdit!._id, {
            title,
            description,
          });
          Swal.fire("Success", "Label updated successfully", "success");
        } else {
          await labelService.createLabel({ title, description });
          Swal.fire("Success", "Label created successfully", "success");
        }
        onSuccess?.(); // 👈 yeh ek hi line handle karega refresh
        closeModal();
      } catch (err) {
        console.error("Label form error:", err);
        Swal.fire("Error", "Operation failed", "error");
      } finally {
        setSubmitting(false);
      }
    },
    [isEditing, title, description, labelToEdit, onSuccess, closeModal]
  );

  useEffect(() => {
    setFormActions?.({
      onSubmit: handleSubmit,
      onCancel: closeModal,
      canSubmit,
      isSubmitting: submitting,
    });
  }, [setFormActions, handleSubmit, closeModal, canSubmit, submitting]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter label title"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
    </form>
  );
}

export default CreateLabelForm;
