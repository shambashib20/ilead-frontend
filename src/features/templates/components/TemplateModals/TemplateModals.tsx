import { useEffect, useState, type ReactNode } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useModalStore } from "@/store/useModalStore";
import WhatsAppPreview from "../WhatsappPreview/WhatsappPreview";
import { useGetTemplate } from "../../hooks/useGetTemplate";
import { useUpdateTemplate } from "../../hooks/useUpdateTemplate";
import { useDeleteTemplate } from "../../hooks/useDeleteTemplate";
import type { Campaign, UpdateTemplatePayload } from "../../service/template.service";

/* ─────────────────────────────────────────────
   VIEW — WhatsApp Preview
───────────────────────────────────────────── */
function TemplatePreviewContent({ templateId }: { templateId: string }) {
  const { data: template, isLoading, isError } = useGetTemplate(templateId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (isError || !template) {
    return (
      <p className="py-8 text-center text-sm text-red-500">
        Failed to load template.
      </p>
    );
  }

  return (
    <div className="px-4 py-4">
      <WhatsAppPreview
        values={{
          title: template.title,
          message: template.message,
          attachments: [],
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   EDIT — form with title + message fields
───────────────────────────────────────────── */
function EditTemplateContent({ template }: { template: Campaign }) {
  const closeModal = useModalStore((s) => s.closeModal);
  const setFormActions = useModalStore((s) => s.setFormActions);
  const { mutateAsync, isPending } = useUpdateTemplate();

  const [formData, setFormData] = useState<UpdateTemplatePayload>({
    title: template.title,
    message: template.message,
  });

  const canSubmit =
    !isPending &&
    (formData.title?.trim() ?? "") !== "" &&
    (formData.message?.trim() ?? "") !== "";

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await mutateAsync({ id: template._id, payload: formData });
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

  return (
    <div className="space-y-4 px-2 py-3">
      <div>
        <Label className="mb-2">Title</Label>
        <Input
          value={formData.title ?? ""}
          onChange={(e) =>
            setFormData((p) => ({ ...p, title: e.target.value }))
          }
          disabled={isPending}
          placeholder="Template title"
        />
      </div>

      <div>
        <Label className="mb-2">Message</Label>
        <Textarea
          rows={6}
          value={formData.message ?? ""}
          onChange={(e) =>
            setFormData((p) => ({ ...p, message: e.target.value }))
          }
          disabled={isPending}
          placeholder="Use *bold*, _italic_, ~strikethrough~, {{variable}}"
          className="resize-none font-mono text-sm"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Supports WhatsApp formatting: *bold* · _italic_ · ~strike~ · &#123;&#123;variable&#125;&#125;
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DELETE — confirmation (same pattern as automation delete)
───────────────────────────────────────────── */
function DeleteTemplateContent({ templateId }: { templateId: string }) {
  const popModal = useModalStore((s) => s.popModal);
  const { mutate, isPending } = useDeleteTemplate();

  const handleConfirm = () => {
    mutate(templateId, { onSuccess: () => popModal() });
  };

  return (
    <div className="space-y-5 px-5 py-6">
      <div className="flex flex-col items-center gap-3">
        <Trash2 className="text-red-500" size={44} strokeWidth={1.5} />
        <h3 className="text-base font-semibold">Delete Template</h3>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Are you sure you want to delete this template?
        <br />
        This action cannot be undone.
      </p>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Button
          variant="destructive"
          onClick={handleConfirm}
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Confirm Delete"}
        </Button>
        <Button variant="outline" onClick={popModal} disabled={isPending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Opener helpers — called from the route
───────────────────────────────────────────── */
type OpenModalFn = (params: {
  title?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "normal";
  type?: "info" | "action" | "form";
  content: ReactNode;
  submitLabel?: string;
}) => void;

export function openTemplatePreviewModal(
  templateId: string,
  openModal: OpenModalFn
) {
  openModal({
    title: "WhatsApp Preview",
    size: "sm",
    content: <TemplatePreviewContent templateId={templateId} />,
  });
}

export function openEditTemplateModal(
  template: Campaign,
  openModal: OpenModalFn
) {
  openModal({
    title: "Edit Template",
    size: "normal",
    type: "form",
    submitLabel: "Save Changes",
    content: <EditTemplateContent template={template} />,
  });
}

export function openDeleteTemplateModal(
  templateId: string,
  openModal: OpenModalFn
) {
  openModal({
    size: "sm",
    content: <DeleteTemplateContent templateId={templateId} />,
  });
}
