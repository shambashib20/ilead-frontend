import { Button } from "@/components/ui/button";

// If you have a proper exported type for your form instance from createFormHook, use it here.
// For now, keep it pragmatic.
type EmailTemplateFormProps = {
  form: any; // replace with your AppFormInstance type if available
};

export default function EmailTemplateForm({ form }: EmailTemplateFormProps) {
  return (
    <div className="space-y-4">
      <form.AppField name="title">
        {(field: any) => <field.TextField label="Title" />}
      </form.AppField>

      <form.AppField name="subject">
        {(field: any) => <field.TextField label="Subject" />}
      </form.AppField>

      <form.AppField name="message">
        {(field: any) => <field.RichTextField label="Message" />}
      </form.AppField>

      <form.AppField name="attachments">
        {(field: any) => <field.FileUploadField label="Attachment" />}
      </form.AppField>

      <div className="flex justify-end pt-4">
        <Button type="button" onClick={() => form.handleSubmit()}>
          Save
        </Button>
      </div>
    </div>
  );
}
