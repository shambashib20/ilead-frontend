"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type SmsTemplateFormProps = {
  form: any; // replace with your AppForm instance type if you have it
};

export default function SmsTemplateForm({ form }: SmsTemplateFormProps) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <form.AppField name="title">
        {(field: any) => <field.TextField label="Title:" />}
      </form.AppField>

      <form.AppField name="message">
        {(field: any) => (
          <field.TextAreaField
            label="Message:"
            rows={5}
            placeholder="Enter SMS Message"
          />
        )}
      </form.AppField>

      {/* Template ID */}
      <form.AppField name="templateId">
        {(field: any) => (
          <div className="space-y-1">
            <field.TextField label="Template ID *" />
            <p className="text-xs text-muted-foreground">
              Use the provider’s approved SMS template ID.
            </p>
          </div>
        )}
      </form.AppField>

      <div className="flex justify-end pt-4">
        <Button type="button" onClick={() => form.handleSubmit()}>
          Save
        </Button>
      </div>
    </div>
  );
}
