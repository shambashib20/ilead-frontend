import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useMedia } from "@/hooks/useMedia";

function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const isMobile = useMedia("(max-width: 767px)");

  return (
    <button
      className="p-0 mt-2 cursor-pointer"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun size={isMobile ? 20 : 24} />
      ) : (
        <Moon size={isMobile ? 20 : 24} />
      )}
    </button>
  );
}

export default ThemeToggler;
