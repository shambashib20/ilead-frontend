// CreateStatusForm.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";

import { useModalStore } from "@/store/useModalStore";
import { useCreateStatus } from "../hooks/useCreateStatus";
import { statusColorMap } from "@/features/leads/utils/constants";
import { useUpdateStatus } from "../hooks/useUpdateStatus";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default function CreateStatusForm({
  status,
}: {
  status?: {
    title: string;
    description: string;
    _id: string;
    meta: {
      color_code: string;
      is_active: boolean;
    };
  };
}) {
  const [isActive, setIsActive] = useState(status?.meta?.is_active ?? true);
  const { createStatus, isPending } = useCreateStatus();
  const { updateStatus, isPending: isUpdatePending } = useUpdateStatus();
  const { closeModal, setFormActions } = useModalStore();

  const form = useForm({
    defaultValues: {
      title: status?.title ?? "",
      description: status?.description ?? "",
      color: status?.meta.color_code ?? "",
    },
    onSubmit: async ({ value }) => {
      //console.log(value);

      if (status) {
        await updateStatus({
          id: status._id,
          title: value.title,
          description: value.description,
          color: value.color,
          is_active: isActive,
        });
      } else {
        await createStatus(value);
      }

      closeModal();
    },
  });

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!title.trim()) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Validation Error",
  //       text: "Title is required.",
  //       confirmButtonText: "OK",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     if (isEditing) {
  //       const payload = {
  //         statusId: statusToEdit._id,
  //         title: title.trim(),
  //         description: description.trim(),
  //         meta: { is_active: isActive },
  //       };
  //       const res = await statusService.editStatus(payload);

  //       if (res.status === "SUCCESS") {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Updated",
  //           text: res.message,
  //           timer: 2000,
  //           showConfirmButton: false,
  //         });
  //         onSuccess?.();
  //       } else {
  //         throw new Error(res.message);
  //       }
  //     } else {
  //       const payload = {
  //         title: title.trim(),
  //         description: description.trim(),
  //       };
  //       const res = await statusService.createStatus(payload);

  //       if (res.status === "CREATED") {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Success",
  //           text: res.message,
  //           timer: 2000,
  //           showConfirmButton: false,
  //         });
  //         onSuccess?.();
  //       } else {
  //         throw new Error(res.message);
  //       }
  //     }
  //   } catch (err: any) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: err.response?.data?.message || "Something went wrong",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  useEffect(() => {
    setFormActions?.({
      onSubmit: () => form.handleSubmit(),
      onCancel: () => form.reset(),
      canSubmit: form.state.canSubmit,
      isSubmitting: isPending || isUpdatePending,
    });
  }, [form.state.canSubmit, isPending || isUpdatePending]);

  const handleCancel = () => {
    form.reset();
    // optionally closeModal() if you want
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 p-2"
    >
      {/* Title field as a type-safe field */}
      <div>
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }: { value: string }) =>
              !value || !value.toString().trim()
                ? "Title is required"
                : undefined,
          }}
        >
          {(field: AnyFieldApi) => {
            return (
              <div>
                <Label htmlFor={field.name} className="mb-2">
                  Status Title *
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., In Progress"
                  required
                  disabled={form.state.isSubmitting}
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        </form.Field>
      </div>

      {/* Description field */}
      <div>
        <form.Field
          name="description"
          validators={{
            // optional: example validator
            onChange: ({ value }: { value: string }) =>
              value && value.toString().length > 500 ? "Too long" : undefined,
          }}
        >
          {(field: AnyFieldApi) => (
            <div>
              <Label htmlFor={field.name} className="mb-2">
                Description
              </Label>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Optional description"
                disabled={form.state.isSubmitting}
              />
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      {/* Color selection — render-prop style like tu chaha tha. Thoda tidy kiya. */}
      <div>
        <form.Field
          name="color"
          validators={{
            onChange: ({ value }: { value: string }) =>
              !value ? "A color is required" : undefined,
          }}
        >
          {(field: AnyFieldApi) => {
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Color <span className="text-red-600">*</span>
                </Label>

                <div className="grid grid-cols-6 gap-3">
                  {[...statusColorMap.entries()].map(
                    ([label, color], index) => (
                      <label
                        key={index}
                        className="relative cursor-pointer"
                        title={label}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={color}
                          checked={field.state.value === color}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-full h-10 rounded-md border-2 transition-all ${
                            field.state.value === color
                              ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                        {field.state.value === color && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                          </div>
                        )}
                      </label>
                    )
                  )}
                </div>

                <FieldInfo field={field} />

                {field.state.value && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">
                      Selected color:
                    </span>
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: field.state.value }}
                    />
                  </div>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      {/* Active toggle only in edit mode */}
      {status && (
        <div className="flex items-center space-x-4">
          <Label htmlFor="active-toggle" className="text-sm font-medium">
            Active
          </Label>
          <Switch
            id="active-toggle"
            checked={isActive}
            onCheckedChange={setIsActive}
            disabled={form.state.isSubmitting}
          />
          <span className="text-sm text-muted-foreground">
            {isActive ? "Status is active" : "Status is inactive"}
          </span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={form.state.isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!form.state.canSubmit || form.state.isSubmitting}
        >
          {form.state.isSubmitting
            ? status
              ? "Updating..."
              : "Creating..."
            : status
              ? "Update"
              : "Create"}
        </Button>
      </div>
    </form>
  );
}
