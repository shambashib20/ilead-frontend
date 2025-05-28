import ThemeToggler from "@/components/ThemeToggler";
import { Link } from "@tanstack/react-router";
import { Bell, Copy, ListTodo, Moon, PhoneMissed, Search } from "lucide-react";

const icons = [PhoneMissed, ListTodo, Copy, Search, Moon, Bell];

export default function HeaderOptionsBox() {
  return (
    <ul className="flex gap-3 items-center">
      {icons.map((Icon, idx) => {
        const isMoon = Icon === Moon;
        if (isMoon) {
          return (
            <li key={idx}>
              <ThemeToggler />
            </li>
          );
        }
        return (
          <li key={idx}>
            <Link to=".">
              <Icon size={22} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
