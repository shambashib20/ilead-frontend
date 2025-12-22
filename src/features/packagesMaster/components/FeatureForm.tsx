import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useCreateFeature } from "../hooks/useCreateFeature";

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

function FeatureForm({
  featureData,
}: {
  featureData?: {
    _id: string;
    title: string;
    description: string;
    status?: string;
    meta?: {
      limit?: number;
    };
  };
}) {
  const { closeModal, setFormActions } = useModalStore();
  const { mutate: createFeature, isLoading: isCreating } = useCreateFeature();

  const isEditMode = !!featureData;

  const form = useForm({
    defaultValues: {
      title: featureData?.title ?? "",
      description: featureData?.description ?? "",
      limit: featureData?.meta?.limit ?? 0,
      status: featureData?.status ?? "ACTIVE",
    },
    onSubmit: async ({ value }) => {
      // Construct the payload according to CreateFeaturePayload structure
      const featurePayload = {
        title: value.title,
        description: value.description,
        meta: {
          limit: value.limit,
        },
      };

      if (!isEditMode) {
        // Create mode
        createFeature(featurePayload, {
          onSuccess: () => {
            closeModal();
          },
        });
      } else {
        // Edit mode
        // TODO: Implement update feature when API is ready
        // updateFeature(
        //   {
        //     featureId: featureData._id,
        //     ...featurePayload,
        //   },
        //   {
        //     onSuccess: () => {
        //       closeModal();
        //     },
        //   }
        // );
        console.log("Edit mode not implemented yet", featurePayload);
      }
    },
  });

  useEffect(() => {
    setFormActions?.({
      onSubmit: () => form.handleSubmit(),
      onCancel: () => form.reset(),
      canSubmit: form.state.canSubmit && !isCreating,
      isSubmitting: form.state.isSubmitting || isCreating,
    });
  }, [
    form.state.canSubmit,
    form.state.isSubmitting,
    isCreating,
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
      {/* Title Field */}
      <div>
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "Title is required"
                : value.length < 3
                  ? "Title must be at least 3 characters"
                  : undefined,
          }}
          children={(field) => {
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Feature Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., Leads Limit for premium Plan"
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />
      </div>

      {/* Description Field */}
      <div>
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "Description is required"
                : value.length < 10
                  ? "Description must be at least 10 characters"
                  : undefined,
          }}
          children={(field) => {
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Leads Limit"
                  rows={3}
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />
      </div>

      {/* Limit Field */}
      <div>
        <form.Field
          name="limit"
          validators={{
            onChange: ({ value }) =>
              value < 0 ? "Limit cannot be negative" : undefined,
          }}
          children={(field) => {
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Limit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min="0"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="300"
                />
                <FieldInfo field={field} />
                <p className="text-xs text-gray-500">
                  Set the limit for this feature (0 for unlimited)
                </p>
              </div>
            );
          }}
        />
      </div>

      {/* Status Field (Only in Edit Mode) */}
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
                        ? "Feature is currently active"
                        : "Feature is currently inactive"}
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

export default FeatureForm;
