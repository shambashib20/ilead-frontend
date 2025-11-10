// components/file-upload-field.tsx
"use client";
import { useStore } from "@tanstack/react-form";
import { useCallback, useRef } from "react";
import { useFieldContext } from "../../contexts/form-context";

type Val = File[]; // store as array of File

const ACCEPT =
  "image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain";

const MAX_MB = 5;
// const MAX_BYTES = MAX_MB * 1024 * 1024;

export default function FileUploadField({
  label,
  multiple = true,
}: {
  label: string;
  multiple?: boolean;
}) {
  const field = useFieldContext<Val>();
  const errors = useStore(field.store, (s) => s.meta.errors);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const next = Array.from(files);
      field.handleChange(
        multiple ? [...(field.state.value ?? []), ...next] : [next[0]]
      );
    },
    [field, multiple]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div
        className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-purple-400"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
          field.handleBlur();
        }}
      >
        <p className="text-sm text-gray-600">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-gray-400">
          Allowed types; up to {MAX_MB} MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple={multiple}
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
          onBlur={field.handleBlur}
        />
      </div>

      {(field.state.value ?? []).length > 0 && (
        <ul className="space-y-1 text-sm">
          {field.state.value!.map((f, i) => (
            <li key={i} className="flex items-center justify-between">
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                className="text-purple-700 hover:underline"
                onClick={() => {
                  const next = [...(field.state.value ?? [])];
                  next.splice(i, 1);
                  field.handleChange(next);
                }}
              >
                remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors.map((msg, i) => (
        <div key={i} className="text-red-600 text-sm">
          {msg}
        </div>
      ))}
    </div>
  );
}
