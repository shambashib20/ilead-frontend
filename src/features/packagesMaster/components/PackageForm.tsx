
// components/PackageForm.jsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo } from "react";
import { useModalStore } from "@/store/useModalStore";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { useCreatePackage } from "../hooks/useCreatePackage";
import { useUpdatePackage } from "../hooks/useUpdatePackage";
import { useFeatures } from "../hooks/useFeature";
import Select from "react-select";
import { useTheme } from "@/contexts/ThemeProvider";

interface Feature {
  _id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "INACTIVE" | string;
  meta?: {
    limit?: number;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

interface OptionType {
  value: string;
  label: string;
}

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
    features: Array<{ _id: string; title: string } | string>;
    status: string;
    meta: {
      package_code: string;
    };
  };
}) {
  const { closeModal, setFormActions } = useModalStore();
  const { mutate: createPackage, isPending: isCreating } = useCreatePackage();
  const { mutate: updatePackage, isPending: isUpdating } = useUpdatePackage();
  const { features, isLoading: isFeaturesLoading } = useFeatures({
    is_table_view: false,
    page: 1,
    limit: 100,
  });

  const { theme } = useTheme();

  const isEditMode = !!packageData;

  // Convert features to react-select options
  const featureOptions: OptionType[] = useMemo(
    () =>
      features?.map((feature: Feature) => ({
        value: feature._id,
        label: feature.title,
      })) || [],
    [features]
  );

  // Extract feature IDs from packageData for default values
  const defaultFeatureIds = useMemo(() => {
    if (!packageData?.features) return [];

    return packageData.features.map((feature) => {
      // Handle both object and string formats
      if (typeof feature === "string") {
        return feature;
      }
      return feature._id;
    });
  }, [packageData?.features]);

  const form = useForm({
    defaultValues: {
      title: packageData?.title ?? "",
      description: packageData?.description ?? "",
      validity: packageData?.validity ?? "",
      validity_in_days: packageData?.validity_in_days ?? 90,
      price: packageData?.price ?? 0,
      features: defaultFeatureIds,
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
        features: value.features, // Just send the array of IDs
        status: value.status,
        meta: {
          package_code: value.package_code,
        },
      };

      if (!isEditMode) {
        createPackage(packagePayload, {
          onSuccess: () => {
            closeModal();
          },
        });
      } else {
        updatePackage(
          {
            packageId: packageData._id,
            ...packagePayload,
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
      canSubmit: form.state.canSubmit && !isCreating && !isUpdating,
      isSubmitting: form.state.isSubmitting || isCreating || isUpdating,
    });
  }, [
    form.state.canSubmit,
    form.state.isSubmitting,
    isCreating,
    isUpdating,
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

      {/* Features Multi-Select Field */}
      <div>
        <form.Field
          name="features"
          validators={{
            onChange: ({ value }) =>
              !value || value.length === 0
                ? "At least one feature is required"
                : undefined,
          }}
          children={(field) => {
            // Convert selected feature IDs to react-select format
            const selectedOptions = featureOptions.filter((option) =>
              field.state.value.includes(option.value)
            );

            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Features <span className="text-red-500">*</span>
                </Label>
                <Select
                  isMulti
                  name={field.name}
                  options={featureOptions}
                  value={selectedOptions}
                  onChange={(selected) => {
                    // Extract IDs from selected options
                    const selectedIds = selected
                      ? selected.map((option) => option.value)
                      : [];
                    field.handleChange(selectedIds);
                  }}
                  onBlur={field.handleBlur}
                  isLoading={isFeaturesLoading}
                  placeholder="Select features..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "40px",
                      borderColor: "#e2e8f0",
                      backgroundColor: "transparent",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "transparent",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: theme === "dark" ? "#ffffffff" : "#000000ff",
                      backgroundColor: "transparent",
                    }),
                    option: (styles: any, state: any) => ({
                      ...styles,
                      fontSize: "14px",
                      backgroundColor: state.isDisabled
                        ? undefined
                        : state.isSelected
                          ? "#3a3285"
                          : state.isFocused
                            ? "#f0f0f0"
                            : undefined,
                      color:
                        state.isFocused || state.isSelected
                          ? "#3a3285"
                          : "#333",
                      cursor: state.isDisabled ? "not-allowed" : "default",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#ffffffff",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#a33030ff",
                      ":hover": {
                        backgroundColor: "#ff0000a4",
                        color: "#ff0000ff",
                      },
                    }),
                  }}
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />
      </div>
    </form>
  );
}

export default PackageForm;
