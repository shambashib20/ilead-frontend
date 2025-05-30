import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

type HeaderActionButtonProps = {
  icon?: LucideIcon;
  label?: string | boolean;
  afterIcon?: LucideIcon;
};

export default function HeaderActionButton({
  icon: Icon,
  label,
  afterIcon: AfterIcon,
}: HeaderActionButtonProps) {
  return (
    <Button variant="rounded" size="icon2">
      {Icon && <Icon className="hidden lg:block" />}{" "}
      <span className="hidden lg:block"> {label}</span>{" "}
      {AfterIcon && <AfterIcon />}
    </Button>
  );
}
