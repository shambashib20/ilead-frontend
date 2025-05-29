import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";

function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="p-0 mt-2"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ?
        <Sun size={24} />
      : <Moon size={24} />}
    </button>
  );
}

export default ThemeToggler;
