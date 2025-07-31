// features/leads/components/CreateSourceForm.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { sourceService } from "@/features/leads/services/Source.service";
import Swal from "sweetalert2";
import { useModalStore } from "@/store/useModalStore";

function CreateSourceForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { closeModal, setFormActions } = useModalStore();

  const canSubmit = title.trim() !== "";

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await sourceService.createSource({ title, description });
      Swal.fire("Success", "Source created successfully", "success");
      closeModal();
    } catch (err) {
      console.error("Create source error:", err);
      Swal.fire("Error", "Failed to create source", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Register form actions with modal
  useEffect(() => {
    setFormActions?.({
      onSubmit: handleSubmit,
      onCancel: closeModal,
      canSubmit,
      isSubmitting: submitting,
    });
  }, [canSubmit, submitting]);

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="title" className="mb-2">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter source title"
          required
        />
      </div>
      <div>
        <Label htmlFor="description" className="mb-2">
          Description
        </Label>
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

export default CreateSourceForm;
