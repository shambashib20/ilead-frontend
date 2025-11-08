import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import {
  fieldContext,
  formContext,
  useFormContext,
} from "../contexts/form-context.tsx";

const TextField = lazy(() => import("../components/TextField"));
const TextAreaField = lazy(() => import("../components/TextAreaField"));
const RichTextField = lazy(() => import("../components/RichTextField"));
const FileUploadField = lazy(() => import("../components/FileUpload"));

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <button disabled={isSubmitting}>{label}</button>}
    </form.Subscribe>
  );
}

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextAreaField,
    RichTextField,
    FileUploadField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
