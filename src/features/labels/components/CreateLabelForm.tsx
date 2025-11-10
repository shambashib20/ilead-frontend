import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// import { type Lables } from "@/features/leads/services/Lable.service";
import { useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import { statusColorMap } from "@/features/leads/utils/constants";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLabel } from "../hooks/useCreateLabel";
import { useUpdateLabel } from "../hooks/useUpdateLable";

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

function CreateLabelForm({
  label,
}: {
  label?: { title: string; description: string; color: string; _id: string };
}) {
  const { closeModal, setFormActions } = useModalStore();
  const { createLable } = useCreateLabel();
  const { updateLabel } = useUpdateLabel();
  const form = useForm({
    defaultValues: {
      title: label?.title ?? "",
      description: label?.description ?? "",
      color: label?.color ?? "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);

      if (label) {
        await updateLabel({
          id: label._id,
          title: value.title,
          description: value.description,
          color: value.color,
        });
      } else {
        await createLable(value);
        closeModal();
      }

      closeModal();
    },
  });

  useEffect(() => {
    setFormActions?.({
      onSubmit: () => form.handleSubmit(),
      onCancel: () => form.reset(),
      canSubmit: form.state.canSubmit,
      isSubmitting: form.state.isSubmitting,
    });
  }, [form.state.canSubmit, form.state.isSubmitting]);

  console.log(label);
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
        {/* A type-safe field component*/}
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A title is required"
                : value.length < 3
                  ? "First name must be at least 3 characters"
                  : undefined,
            // onChangeAsyncDebounceMs: 500,
            // onChangeAsync: async ({ value }) => {
            //   await new Promise((resolve) => setTimeout(resolve, 1000));
            //   return (
            //     value.includes("error") && 'No "error" allowed in first name'
            //   );
            // },
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Title <span>*</span>
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
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
        {/* A type-safe field component*/}
        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A description is required"
                : value.length < 3
                  ? "description must be at least 3 characters"
                  : undefined,
            // onChangeAsyncDebounceMs: 500,
            // onChangeAsync: async ({ value }) => {
            //   await new Promise((resolve) => setTimeout(resolve, 1000));
            //   return (
            //     value.includes("error") && 'No "error" allowed in first name'
            //   );
            // },
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Description <span>*</span>
                </Label>
                <Textarea
                  id={field.name}
                  name={field.name}
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
        {/* A type-safe field component*/}
        <form.Field
          name="color" // Fixed field name from "description" to "color"
          validators={{
            onChange: ({ value }) =>
              !value ? "A color is required" : undefined,
          }}
          children={(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>
                  Color <span>*</span>
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
                          <div className="absolute inset-0 flex items-center justify-center">
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
        />
      </div>
    </form>
  );
}

export default CreateLabelForm;
