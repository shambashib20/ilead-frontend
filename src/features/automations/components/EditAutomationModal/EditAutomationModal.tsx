import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { useStatus } from "@/features/leads/hooks/useStatus";
import { useAllLabels } from "@/features/leads/hooks/useAllLabels";
import { useCampaigns } from "@/features/templates/hooks/useCampaigns";
import { useUpdateAutomation } from "../../hooks/updateAutomation";
import type { Automation, AutomationRule, UpdateAutomationPayload } from "../../services/automation.service";

type RuleFormItem = {
  device_type: string;
  status_id: string;
  label_id: string;
  template_id: string;
};

type EditFormState = {
  type: string;
  lead_type: string;
  invoice_type: string;
  is_active: boolean;
  rules: RuleFormItem[];
};

function extractId(field: string | { _id: string } | undefined): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field._id;
}

function buildPayload(formData: EditFormState): UpdateAutomationPayload {
  const rules: AutomationRule[] = formData.rules.map((r) => ({
    device_type: r.device_type,
    status_id: r.status_id,
    label_id: r.label_id,
    template_id: r.template_id,
  }));

  return {
    ...(formData.type && { type: formData.type }),
    ...(formData.lead_type && { lead_type: formData.lead_type }),
    ...(formData.invoice_type && { invoice_type: formData.invoice_type }),
    rules,
    meta: { is_active: formData.is_active },
  };
}

export function EditAutomationModal({ automation }: { automation: Automation }) {
  const closeModal = useModalStore((s) => s.closeModal);
  const setFormActions = useModalStore((s) => s.setFormActions);

  const { status } = useStatus();
  const { allLables } = useAllLabels();
  const { campaigns } = useCampaigns();
  const { mutateAsync, isPending } = useUpdateAutomation();

  const [formData, setFormData] = useState<EditFormState>({
    type: automation.type ?? "",
    lead_type: automation.lead_type ?? "",
    invoice_type: (automation as any).invoice_type ?? "",
    is_active: automation.meta?.is_active ?? true,
    rules: automation.rules.map((r) => ({
      device_type: r.device_type ?? "",
      status_id: extractId(r.status_id as any),
      label_id: extractId(r.label_id as any),
      template_id: extractId(r.template_id as any),
    })),
  });

  const canSubmit = !isPending;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const payload = buildPayload(formData);
    await mutateAsync({ id: automation._id, payload });
    closeModal();
  };

  useEffect(() => {
    setFormActions({
      onSubmit: handleSubmit,
      onCancel: closeModal,
      canSubmit,
      isSubmitting: isPending,
    });
  }, [formData, canSubmit, isPending]);

  const updateRule = (index: number, key: keyof RuleFormItem, value: string) => {
    setFormData((prev) => {
      const rules = [...prev.rules];
      rules[index] = { ...rules[index], [key]: value };
      return { ...prev, rules };
    });
  };

  const addRule = () => {
    setFormData((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        { device_type: "", status_id: "", label_id: "", template_id: "" },
      ],
    }));
  };

  const removeRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-5 px-2 py-3">
      {/* Type + Lead Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2">Automation Type</Label>
          <Select
            value={formData.type}
            onValueChange={(v) => setFormData((prev) => ({ ...prev, type: v }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LEAD_AUTOMATION">Lead Automation</SelectItem>
              <SelectItem value="MEETING_AUTOMATION">Meeting Automation</SelectItem>
              <SelectItem value="INVOICE_AUTOMATION">Invoice Automation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === "LEAD_AUTOMATION" && (
          <div>
            <Label className="mb-2">Lead Type</Label>
            <Select
              value={formData.lead_type}
              onValueChange={(v) => setFormData((prev) => ({ ...prev, lead_type: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select lead type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIRST_MESSAGE">First Message</SelectItem>
                <SelectItem value="NEXT_FOLLOWUP">Next Followup</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {formData.type === "INVOICE_AUTOMATION" && (
          <div>
            <Label className="mb-2">Invoice Type</Label>
            <Select
              value={formData.invoice_type}
              onValueChange={(v) => setFormData((prev) => ({ ...prev, invoice_type: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select invoice type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERATED_INVOICE">Generated Invoice</SelectItem>
                <SelectItem value="CONVERTED_PAID_INVOICE">Converted Paid Invoice</SelectItem>
                <SelectItem value="GENERATED_QUOTATION">Generated Quotation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, is_active: checked }))
          }
        />
        <Label>Active</Label>
      </div>

      {/* Rules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Rules</Label>
          <Button type="button" size="sm" variant="outline" onClick={addRule}>
            <Plus size={14} className="mr-1" /> Add Rule
          </Button>
        </div>

        {formData.rules.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No rules yet. Click "Add Rule" to add one.
          </p>
        )}

        {formData.rules.map((rule, i) => (
          <div
            key={i}
            className="border rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="md:col-span-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Rule {i + 1}</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-red-500 hover:bg-red-50 p-1"
                onClick={() => removeRule(i)}
              >
                <Trash2 size={14} />
              </Button>
            </div>

            {/* Device Type */}
            <div>
              <Label className="mb-1 text-xs">Device Type</Label>
              <Select
                value={rule.device_type}
                onValueChange={(v) => updateRule(i, "device_type", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF_DEVICE">Staff Device</SelectItem>
                  <SelectItem value="GENERAL_DEVICE">General Device</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label className="mb-1 text-xs">Status</Label>
              <Select
                value={rule.status_id}
                onValueChange={(v) => updateRule(i, "status_id", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {(status as any)?.data?.map((s: any) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Label */}
            <div>
              <Label className="mb-1 text-xs">Label</Label>
              <Select
                value={rule.label_id}
                onValueChange={(v) => updateRule(i, "label_id", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select label" />
                </SelectTrigger>
                <SelectContent>
                  {(allLables as any)?.data?.map((l: any) => (
                    <SelectItem key={l._id} value={l._id}>
                      {l.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template */}
            <div>
              <Label className="mb-1 text-xs">Template</Label>
              <Select
                value={rule.template_id}
                onValueChange={(v) => updateRule(i, "template_id", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns?.map((c: any) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
