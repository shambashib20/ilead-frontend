// CreateStatusForm.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { statusService } from "@/features/leads/services/Status.service";
import type { Status } from "@/features/leads/services/Status.service";
import Swal from "sweetalert2";
import { Switch } from "@/components/ui/switch";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
  statusToEdit?: Status;
};

export default function CreateStatusForm({
  onSuccess,
  onCancel,
  statusToEdit,
}: Props) {
  const [title, setTitle] = useState(statusToEdit?.title || "");
  const [description, setDescription] = useState(
    statusToEdit?.description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(
    statusToEdit?.meta?.is_active ?? true
  );

  const isEditing = !!statusToEdit;

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

    setIsSubmitting(true);
    try {
      if (isEditing) {
        const payload = {
          statusId: statusToEdit._id,
          title: title.trim(),
          description: description.trim(),
          meta: { is_active: isActive },
        };
        const res = await statusService.editStatus(payload);

        if (res.status === "SUCCESS") {
          Swal.fire({
            icon: "success",
            title: "Updated",
            text: res.message,
            timer: 2000,
            showConfirmButton: false,
          });
          onSuccess?.();
        } else {
          throw new Error(res.message);
        }
      } else {
        const payload = {
          title: title.trim(),
          description: description.trim(),
        };
        const res = await statusService.createStatus(payload);

        if (res.status === "CREATED") {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.message,
            timer: 2000,
            showConfirmButton: false,
          });
          onSuccess?.();
        } else {
          throw new Error(res.message);
        }
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <div>
        <Label htmlFor="title" className="mb-2">
          Status Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., In Progress"
          required
          disabled={isSubmitting}
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
          placeholder="Optional description"
          disabled={isSubmitting}
        />
      </div>

      {isEditing && (
        <div className="flex items-center space-x-4">
          <Label htmlFor="active-toggle" className="text-sm font-medium">
            Active
          </Label>
          <Switch
            id="active-toggle"
            checked={isActive}
            onCheckedChange={setIsActive}
            disabled={isSubmitting}
          />
          <span className="text-sm text-muted-foreground">
            {isActive ? "Status is active" : "Status is inactive"}
          </span>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
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
