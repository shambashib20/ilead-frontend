import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

type HeaderActionButtonProps = {
  icon: LucideIcon;
  label: string;
  afterIcon?: LucideIcon;
};

export default function HeaderActionButton({ icon: Icon, label, afterIcon: AfterIcon }: HeaderActionButtonProps) {
  return (
    <Button variant="rounded" size="icon2">
      <Icon /> {label} {AfterIcon && <AfterIcon />}
    </Button>
  );
}
