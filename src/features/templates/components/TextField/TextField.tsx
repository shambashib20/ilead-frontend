// components/text-field.tsx
import { useStore } from "@tanstack/react-form"; // or '@tanstack/react-store' if needed
import { useFieldContext } from "../../contexts/form-context";

export default function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (s) => s.meta.errors);

  return (
    <div >
      <label className="text-sm font-light text-gray-600 dark:text-gray-50 space-y-2">
        <div>
          {label} <span className="text-red-500">*</span>
        </div>
        <input
          value={field.state.value ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className="w-full px-4 py-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
      {errors.map((msg, i) => (
        <div key={i} style={{ color: "red" }}>
          {msg}
        </div>
      ))}
    </div>
  );
}
