import { createFileRoute } from "@tanstack/react-router";
import LabelCard from "@/features/labels/components/LabelCard";

export const Route = createFileRoute("/_dashboardLayout/label/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LabelCard />;
}
