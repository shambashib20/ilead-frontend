// components/textarea-field.tsx
import { useStore } from "@tanstack/react-form"; // or '@tanstack/react-store' if types complain
import { useFieldContext } from "../../contexts/form-context";

export default function TextAreaField({
  label,
  rows = 5,
  placeholder,
}: {
  label: string;
  rows?: number;
  placeholder?: string;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (s) => s.meta.errors);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-light text-gray-600 dark:text-gray-200">
        {label}
        <span className="text-red-500">*</span>
      </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {errors.map((msg, i) => (
        <div key={i} className="text-red-600 text-sm">
          {msg}
        </div>
      ))}
    </div>
  );
}
