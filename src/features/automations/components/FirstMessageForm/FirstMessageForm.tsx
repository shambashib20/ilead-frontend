"use client";
import { useForm } from "@tanstack/react-form";
// Optional: devtools
// import { TanStackDevtools } from '@tanstack/react-devtools'
// import { FormDevtoolsPlugin } from '@tanstack/react-form-devtools'

type DeviceType = "Staff Device" | "Meta Device";
type Status = "New" | "Open" | "In Progress" | "Closed";
type Label = "Hot" | "Warm" | "Cold";
type Template = "Welcome" | "Follow Up" | "Reminder";

interface Rule {
  deviceType: DeviceType | "";
  status: Status | "";
  label: Label | "";
  template: Template | "";
}

interface FormValues {
  rules: Rule[];
}

const defaultValues: FormValues = {
  rules: [], // start empty; rows only via "Add Rules"
};

export default function FirstMessageForm() {
  const form = useForm({
    defaultValues,
    onSubmit({ value }) {
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">First Message</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Rules Array */}
        <form.Field name="rules" mode="array">
          {(field) => (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Add Rules</div>
                <button
                  type="button"
                  onClick={() =>
                    field.pushValue({
                      deviceType: "",
                      status: "",
                      label: "",
                      template: "",
                    })
                  }
                  className="px-3 py-2 rounded border"
                >
                  + Add Rule
                </button>
              </div>

              {/* Rows */}
              {field.state.value.length === 0 ? (
                <p className="text-sm opacity-70">
                  No rules yet. Click “+ Add Rule.”
                </p>
              ) : null}

              {field.state.value.map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-3 grid gap-3 md:grid-cols-5"
                >
                  <div className="md:col-span-5 flex items-center justify-between">
                    <span className="text-sm font-semibold">Rules {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => field.removeValue(i)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Device Type */}
                  <form.Field name={`rules[${i}].deviceType`}>
                    {(fDev) => (
                      <div className="flex flex-col">
                        <label className="text-sm mb-1">Device Type *</label>
                        <select
                          value={fDev.state.value}
                          onChange={(e) =>
                            fDev.handleChange(e.target.value as DeviceType)
                          }
                          onBlur={fDev.handleBlur}
                          className="border rounded p-2"
                          required
                        >
                          <option value="">Select Device...</option>
                          <option value="Staff Device">Staff Device</option>
                          <option value="Meta Device">Meta Device</option>
                        </select>
                      </div>
                    )}
                  </form.Field>

                  {/* Status */}
                  <form.Field name={`rules[${i}].status`}>
                    {(fStatus) => (
                      <div className="flex flex-col">
                        <label className="text-sm mb-1">Status *</label>
                        <select
                          value={fStatus.state.value}
                          onChange={(e) =>
                            fStatus.handleChange(e.target.value as Status)
                          }
                          onBlur={fStatus.handleBlur}
                          className="border rounded p-2"
                          required
                        >
                          <option value="">Select Status...</option>
                          <option value="New">New</option>
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    )}
                  </form.Field>

                  {/* Label */}
                  <form.Field name={`rules[${i}].label`}>
                    {(fLabel) => (
                      <div className="flex flex-col">
                        <label className="text-sm mb-1">Label *</label>
                        <select
                          value={fLabel.state.value}
                          onChange={(e) =>
                            fLabel.handleChange(e.target.value as Label)
                          }
                          onBlur={fLabel.handleBlur}
                          className="border rounded p-2"
                          required
                        >
                          <option value="">Select Label...</option>
                          <option value="Hot">Hot</option>
                          <option value="Warm">Warm</option>
                          <option value="Cold">Cold</option>
                        </select>
                      </div>
                    )}
                  </form.Field>

                  {/* Template */}
                  <form.Field name={`rules[${i}].template`}>
                    {(fTpl) => (
                      <div className="flex flex-col">
                        <label className="text-sm mb-1">Template *</label>
                        <select
                          value={fTpl.state.value}
                          onChange={(e) =>
                            fTpl.handleChange(e.target.value as Template)
                          }
                          onBlur={fTpl.handleBlur}
                          className="border rounded p-2"
                          required
                        >
                          <option value="">Select Template...</option>
                          <option value="Welcome">Welcome</option>
                          <option value="Follow Up">Follow Up</option>
                          <option value="Reminder">Reminder</option>
                        </select>
                      </div>
                    )}
                  </form.Field>
                </div>
              ))}
            </div>
          )}
        </form.Field>

        {/* Submit */}
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
            >
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
          )}
        />
      </form>

      {/* Optional: Devtools
      <TanStackDevtools config={{ hideUntilHover: true }} plugins={[FormDevtoolsPlugin()]} />
      */}
    </div>
  );
}
