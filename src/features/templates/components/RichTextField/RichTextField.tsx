// components/richtext-field.tsx
"use client";
import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../../contexts/form-context";
import React from "react";

// your provided editor, default export
const RichTextEditor = React.lazy(
  () => import("../RichTextEditor/RichTextEditor")
);

export default function RichTextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (s) => s.meta.errors);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-light">
        {label} <span className="text-red-500">*</span>{" "}
      </label>
      <RichTextEditor
        value={field.state.value ?? ""}
        onChange={(val) => field.handleChange(val)}
        onBlur={field.handleBlur}
      />
      {errors.map((msg, i) => (
        <div key={i} className="text-red-600 text-sm">
          {msg}
        </div>
      ))}
    </div>
  );
}
