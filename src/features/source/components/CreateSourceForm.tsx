// CreateSourceForm.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  sourceService,
  type Source,
} from "@/features/leads/services/Source.service";
import Swal from "sweetalert2";
import { useModalStore } from "@/store/useModalStore";
import { Button } from "@/components/ui/button";

interface CreateSourceFormProps {
  sourceToEdit?: Source;
  onSuccess?: () => void;
}

function CreateSourceForm({ sourceToEdit, onSuccess }: CreateSourceFormProps) {
  const [title, setTitle] = useState(sourceToEdit?.title || "");
  const [description, setDescription] = useState(
    sourceToEdit?.description || ""
  );
  const isEditing = !!sourceToEdit;
  const [submitting, setSubmitting] = useState(false);
  const { closeModal } = useModalStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Title is required.",
        confirmButtonText: "OK",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (sourceToEdit) {
        // Editing logic
        await sourceService.editSource(sourceToEdit._id, {
          title: title.trim(),
          description: description.trim(),
        });
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Source updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Creation logic
        await sourceService.createSource({
          title: title.trim(),
          description: description.trim(),
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Source created successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      onSuccess?.();
      closeModal();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Operation failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="mb-2">
          Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter source title"
          required
          disabled={submitting}
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
          disabled={submitting}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update"
              : "Create"}
        </Button>
      </div>
    </form>
  );
}

export default CreateSourceForm;
