// components/PackageForm.jsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useCreatePackage } from "../hooks/useCreatePackage";
import { X } from "lucide-react";

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

function PackageForm({
  packageData,
}: {
  packageData?: {
    _id: string;
    title: string;
    description: string;
    validity: string;
    validity_in_days: number;
    price: number;
    features: string[];
    status: string;
    meta: {
      package_code: string;
    };
  };
}) {
  const { closeModal, setFormActions } = useModalStore();
  const { mutate: createPackage, isLoading: isCreating } = useCreatePackage();

  const isEditMode = !!packageData;

  const form = useForm({
    defaultValues: {
      title: packageData?.title ?? "",
      description: packageData?.description ?? "",
      validity: packageData?.validity ?? "",
      validity_in_days: packageData?.validity_in_days ?? 90,
      price: packageData?.price ?? 0,
      features: packageData?.features ?? [""],
      status: packageData?.status ?? "ACTIVE",
      package_code: packageData?.meta?.package_code ?? "",
    },
    onSubmit: async ({ value }) => {
      const packagePayload = {
        title: value.title,
        description: value.description,
        validity: value.validity,
        validity_in_days: String(value.validity_in_days),
        price: String(value.price),
        features: value.features.filter((id) => id.trim() !== ""),
        status: value.status,
        meta: {
          package_code: value.package_code,
        },
      };

      if (!isEditMode) {
        // Create mode
        createPackage(packagePayload, {
          onSuccess: () => {
            closeModal();
          },
        });
      } else {
        // Edit mode
        // updatePackage(
        //   {
        //     packageId: packageData._id,
        //     ...packagePayload,
        //   },
        //   {
        //     onSuccess: () => {
        //       closeModal();
        //     },
        //   }
        // );
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
                  Package Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g., 3 Month Premium Plan"
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
                  placeholder="Access for 3 months with all premium features"
                  rows={3}
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />
      </div>

      {/* Validity Date and Days */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <form.Field
            name="validity"
            validators={{
              onChange: ({ value }) =>
                !value ? "Validity date is required" : undefined,
            }}
            children={(field) => {
              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>
                    Validity Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="datetime-local"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          />
        </div>

        <div>
          <form.Field
            name="validity_in_days"
            validators={{
              onChange: ({ value }) =>
                !value || value < 1 ? "Must be at least 1 day" : undefined,
            }}
            children={(field) => {
              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>
                    Validity in Days <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="1"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="90"
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* Price and Package Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <form.Field
            name="price"
            validators={{
              onChange: ({ value }) =>
                value < 0 ? "Price cannot be negative" : undefined,
            }}
            children={(field) => {
              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>
                    Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="1500"
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          />
        </div>

        <div>
          <form.Field
            name="package_code"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Package code is required"
                  : value.length < 2
                    ? "Package code must be at least 2 characters"
                    : undefined,
            }}
            children={(field) => {
              return (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>
                    Package Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="PREMIUM_3M"
                  />
                  <FieldInfo field={field} />
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* Features Array Field */}
      <div>
        <form.Field name="features" mode="array">
          {(field) => (
            <div className="flex flex-col gap-2">
              <Label>Features (Feature IDs)</Label>
              {field.state.value.map((_, index) => (
                <form.Field key={index} name={`features[${index}]`}>
                  {(subField) => (
                    <div className="flex gap-2">
                      <Input
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(e.target.value)}
                        placeholder="68f093603276ca61e184270a"
                        className="flex-1"
                      />
                      {field.state.value.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => field.removeValue(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </form.Field>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => field.pushValue("")}
                className="w-full"
              >
                + Add Feature
              </Button>
            </div>
          )}
        </form.Field>
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
                        ? "Package is currently active"
                        : "Package is currently inactive"}
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

export default PackageForm;
