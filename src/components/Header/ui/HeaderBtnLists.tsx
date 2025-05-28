import { Button } from '@/components/ui/button';
import HeaderActionButton from './HeaderBtn';
import {
  Bell,
  Calendar,
  Ellipsis,
  Funnel,
  Plus,
  Presentation,
  SquareCheckBig,
} from "lucide-react";

const headerButtons = [
  { label: "Lead", icon: Plus, afterIcon: Funnel },
  { label: "Task", icon: Plus, afterIcon: Calendar },
  { label: "Note", icon: Plus, afterIcon: SquareCheckBig },
  { label: "Remider", icon: Plus, afterIcon: Bell },
  { label: "Meeting", icon: Plus, afterIcon: Presentation },
];

function HeaderBtnLists() {
  return (
    <ul className="flex gap-2 items-center">
      {headerButtons.map((btn, index) => (
        <li key={index}>
          <HeaderActionButton
            icon={btn.icon}
            label={btn.label}
            afterIcon={btn.afterIcon}
          />
        </li>
      ))}

      <li>
        <Button size="icon" className="rounded-full h-8 w-8">
          <Ellipsis />
        </Button>
      </li>
    </ul>
  );
}

export default HeaderBtnLists;
