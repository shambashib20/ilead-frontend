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
    description: initialData.description,
  });

  const { data } = useUser(); // user data with role

  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeModal = useModalStore((state) => state.closeModal);
  const setFormActions = useModalStore((state) => state.setFormActions);

  const isSuperAdmin = data?.role === "Superadmin";

  const canSubmit = isSuperAdmin
    ? formData.description.trim() !== ""
    : formData.name.trim() !== "" && formData.description.trim() !== "";

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
          // Only reload if you absolutely must
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
  }, [formData, canSubmit, isSubmitting]);

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
          disabled={isSuperAdmin} // disable for superadmin
        />
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
        />
      </div>
    </div>
  );
}
