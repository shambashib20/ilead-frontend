"use client";
import { useForm } from "@tanstack/react-form";
import type { CreateAutomationPayload } from "../../services/automation.service";
// import { useCreateAutomation } from "../../hooks/createAutomation";
import { useStatus } from "@/features/leads/hooks/useStatus";
import { useAllLabels } from "@/features/leads/hooks/useAllLabels";
import { useCampaigns } from "@/features/templates/hooks/useCampaigns";
import { useCreateAutomation } from "../../hooks/createAutomation";
// Optional: devtools
// import { TanStackDevtools } from '@tanstack/react-devtools'
// import { FormDevtoolsPlugin } from '@tanstack/react-form-devtools'

interface Rule {
  deviceType: string | "";
  status: string | "";
  label: string | "";
  template: string | "";
}

interface FormValues {
  rules: Rule[];
}

const defaultValues: FormValues = {
  rules: [], // start empty; rows only via "Add Rules"
};

function buildAutomationPayload(
  typeObj: { type: string; lead_type: string },
  formValue: FormValues
): CreateAutomationPayload {
  return {
    type: typeObj.type,
    lead_type: typeObj.lead_type,
    rules: formValue.rules.map((r) => ({
      device_type: r.deviceType,
      status_id: r.status,
      label_id: r.label,
      template_id: r.template,
    })),
    meta: {
      created_by: "Admin",
      trigger_source: "Dashboard",
    },
  };
}

export default function FirstMessageForm({ type }: { type: any }) {
  const { mutateAsync, isPending } = useCreateAutomation();
  const { status } = useStatus();
  const { allLables } = useAllLabels();
  const { campaigns } = useCampaigns();
  const form = useForm({
    defaultValues,
    onSubmit({ value }) {
      // Build payload from `type` prop + form values
      const payload = buildAutomationPayload(type, value);

      // Logging to inspect final payload
      console.log("TYPE PROP:", type);
      console.log("FORM VALUE:", value);
      console.log("FINAL PAYLOAD:", payload);

      // Fire the mutation
      mutateAsync(payload);
    },
  });

  console.log(campaigns);

  return (
    <div className="w-full  p-4 space-y-4">
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
                className="px-3 py-2 rounded border w-full"
              >
                + Add Rule
              </button>
              {/* Rows */}
              {field.state.value.length === 0 ? (
                <p className="text-sm opacity-70">
                  No rules yet. Click “+ Add Rule.”
                </p>
              ) : null}

              {field.state.value.map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-3 grid gap-3 md:grid-cols-4"
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
                          onChange={(e) => fDev.handleChange(e.target.value)}
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
                          onChange={(e) => fStatus.handleChange(e.target.value)}
                          onBlur={fStatus.handleBlur}
                          className="border rounded p-2"
                          required
                        >
                          <option value="">Select Status...</option>
                          {status.data.map((stat) => (
                            <option value={stat._id}>{stat.title}</option>
                          ))}
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
                          onChange={(e) => fLabel.handleChange(e.target.value)}
                          onBlur={fLabel.handleBlur}
                          className="border rounded p-2"
                          required
                        >
                          <option value="">Select Label...</option>
                          {allLables.data.map((stat) => (
                            <option value={stat._id}>{stat.title}</option>
                          ))}
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
                          onChange={(e) => fTpl.handleChange(e.target.value)}
                          onBlur={fTpl.handleBlur}
                          className="border rounded p-2"
                          required
                        >
                          <option value="">Select Template...</option>
                          {campaigns.map((stat) => (
                            <option value={stat._id}>{stat.title}</option>
                          ))}
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
