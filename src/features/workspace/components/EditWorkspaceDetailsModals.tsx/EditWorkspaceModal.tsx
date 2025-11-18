// components/modals/EditWorkspaceModal.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // if available
import { workspaceService } from "@/features/workspace/services/Property.service";
import { useModalStore } from "@/store/useModalStore";
import Swal from "sweetalert2";
import { useUser } from "@/features/auth/hooks/useUser";

export function EditWorkspaceModal({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState({
    propId: initialData._id,
    name: initialData.name,
    description: initialData.description ?? "",
  });

  const { data } = useUser(); // user data with role

  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeModal = useModalStore((state) => state.closeModal);
  const setFormActions = useModalStore((state) => state.setFormActions);

  const role = (data as any)?.role ?? (data as any)?.data?.role ?? "";
  const isSuperAdmin = role === "Superadmin";

  // lock name if it contains "mr group" (case-insensitive)
  const isMrGroupLocked =
    typeof initialData.name === "string" &&
    initialData.name.toLowerCase().includes("mr group");

  // overall edit permission: only superadmin
  const canEdit = isSuperAdmin;

  // can edit name only if superadmin AND not MR Group workspace
  const canEditName = canEdit && !isMrGroupLocked;

  const canSubmit =
    canEdit &&
    formData.description.trim() !== "" &&
    (canEditName ? formData.name.trim() !== "" : true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const res = await workspaceService.updateProperty(formData);
      const { status, message } = res.data || {};

      if (status === "CREATED") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Workspace updated successfully",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });

        setTimeout(() => {
          closeModal?.();
          window.location.reload();
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message || "Failed to update",
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFormActions?.({
      onSubmit: handleSubmit,
      onCancel: closeModal,
      canSubmit,
      isSubmitting,
    });
  }, [formData, canSubmit, isSubmitting, closeModal, setFormActions]);

  return (
    <div className="space-y-4 px-2 py-3">
      {/* Name field */}
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!canEditName}
        />
        {!isSuperAdmin && (
          <p className="mt-1 text-xs text-muted-foreground">
            Only Superadmin can edit workspace details.
          </p>
        )}
        {isSuperAdmin && isMrGroupLocked && (
          <p className="mt-1 text-xs text-muted-foreground">
            Workspaces containing <strong>“MR Group”</strong> in the name cannot
            be renamed.
          </p>
        )}
      </div>

      {/* Description field */}
      <div>
        <Label htmlFor="description" className="mb-2">
          Description
        </Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          disabled={!canEdit}
        />
        {!isSuperAdmin && (
          <p className="mt-1 text-xs text-muted-foreground">
            Only Superadmin can edit the workspace description.
          </p>
        )}
      </div>
    </div>
  );
}
