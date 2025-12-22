import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreateAddon } from "../hooks/useCreateAddons";
import { useUpdateAddon } from "../hooks/useUpdateAddons";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-sm text-red-500">
          {field.state.meta.errors.join(", ")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? (
        <span className="text-sm text-gray-500">Validating...</span>
      ) : null}
    </>
  );
}

function CreateAddon({
  addon,
}: {
  addon?: {
    title: string;
    description: string;
    value: string;
    _id: string;
    status: string;
  };
}) {
  const { closeModal, setFormActions } = useModalStore();
  const { createAddon, isLoading } = useCreateAddon();
  const { updateAddon, isLoading: isLoading2 } = useUpdateAddon();

  const isEditMode = !!addon;

  const form = useForm({
    defaultValues: {
      title: addon?.title ?? "",
      description: addon?.description ?? "",
      value: addon?.value ?? "",
      status: addon?.status ?? "ACTIVE",
    },
    onSubmit: async ({ value }) => {
      if (!addon) {
        // Create mode
        createAddon(
          {
            title: value.title,
            description: value.description,
            value: value.value,
          },
          {
            onSuccess: () => {
              closeModal();
            },
          }
        );
      } else {
        // Edit mode
        updateAddon(
          {
            addOnId: addon._id,
            title: value.title,
            description: value.description,
            value: value.value,
            status: value.status,
          },
          {
            onSuccess: () => {
              closeModal();
            },
          }
        );
      }
    },
  });

  useEffect(() => {
    setFormActions?.({
      onSubmit: () => form.handleSubmit(),
      onCancel: () => form.reset(),
      canSubmit: form.state.canSubmit && !isLoading && !isLoading2,
      isSubmitting: form.state.isSubmitting || isLoading || isLoading2,
    });
  }, [
    form.state.canSubmit,
    form.state.isSubmitting,
    isLoading,
    isLoading2,
    setFormActions,
    form,
  ]);

  return (
    <form
      className="space-y-4 px-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A title is required"
                : value.length < 3
                  ? "Title must be at least 3 characters"
                  : undefined,
          }}
          children={(field) => {
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Addon Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter addon title"
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />
      </div>

      <div>
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A description is required"
                : value.length < 3
                  ? "Description must be at least 3 characters"
                  : undefined,
          }}
          children={(field) => {
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Addon Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter addon description"
                  rows={4}
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />
      </div>

      <div>
        <form.Field
          name="value"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A value is required"
                : value.length < 1
                  ? "Value must be at least 1 character"
                  : undefined,
          }}
          children={(field) => {
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Addon Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter addon value"
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />
      </div>

      {isEditMode && (
        <div>
          <form.Field
            name="status"
            children={(field) => {
              return (
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor={field.name} className="text-base">
                      Status
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      {field.state.value === "ACTIVE"
                        ? "Addon is currently active"
                        : "Addon is currently inactive"}
                    </div>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.state.value === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked ? "ACTIVE" : "INACTIVE")
                    }
                  />
                </div>
              );
            }}
          />
        </div>
      )}
    </form>
  );
}

export default CreateAddon;
