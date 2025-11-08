"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Bold, Italic } from "lucide-react";

// Replace `any` with your AppForm instance type if you’ve exported one.
type WhatsappTemplateFormProps = {
  form: any;
};

// Tokens you support in messages
const VARS = [
  "[[customerName]]",
  "[[customerNumber]]",
  "[[customerEmail]]",
  "[[customerAddress]]",
  "[[customerCompany]]",
  "[[customerGST]]",
];

export default function WhatsappTemplateForm({
  form,
}: WhatsappTemplateFormProps) {
  const [varPick, setVarPick] = useState<string>(VARS[0]);

  // helpers operate on the *message* field’s value
  const insertAtEnd = (field: any, token: string) => {
    const v = field.state.value ?? "";
    field.handleChange(v + (v && !v.endsWith(" ") ? " " : "") + token + " ");
  };

  const wrapWith = (field: any, left: string, right: string) => {
    const v = field.state.value ?? "";
    field.handleChange(v + `${left}text${right}`);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <form.AppField name="title">
        {(field: any) => <field.TextField label="Title:" />}
      </form.AppField>

      {/* Message + toolbar + variables */}
      <form.AppField name="message">
        {(field: any) => (
          <div className="space-y-2">
            <field.TextAreaField
              label="Message:"
              rows={6}
              placeholder="Enter Message"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <select
                  value={varPick}
                  onChange={(e) => setVarPick(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                >
                  {VARS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  onClick={() => insertAtEnd(field, varPick)}
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  + Add Variable
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => wrapWith(field, "*", "*")}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => wrapWith(field, "_", "_")}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-[13px] leading-5">
              <span className="font-semibold text-red-600">Note:</span> Wherever
              you use this template, you can replace the value of with variables
              like{" "}
              <span className="font-semibold text-red-600">
                [[customerName]], [[customerNumber]], [[customerEmail]],
                [[customerAddress]], [[customerCompany]], [[customerGST]]
              </span>{" "}
              in the message.
            </p>
          </div>
        )}
      </form.AppField>

      {/* Attachment uploader + mic button on the right */}
      <div>
        <label className="mb-1 block text-sm text-gray-700">Attachment :</label>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <form.AppField name="attachments">
              {(field: any) => <field.FileUploadField label="" />}
            </form.AppField>
          </div>
          <Button type="button" variant="outline" className="shrink-0">
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Allowed IMAGES, VIDEOS, PDF, DOC, EXCEL, PPT, TEXT — max size of 5 MB
        </p>
      </div>

      {/* Save */}
      <div className="flex justify-end pt-4">
        <Button type="button" onClick={() => form.handleSubmit()}>
          Save
        </Button>
      </div>
    </div>
  );
}
