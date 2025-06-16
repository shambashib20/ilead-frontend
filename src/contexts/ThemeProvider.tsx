import { getData, setData } from "@/utils/localStorage";
import React, { createContext, useState, useEffect, use } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

type themeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

const ThemeContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: themeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    getData(storageKey) ?? defaultTheme
  );
  // const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dark", "light");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      setData(storageKey, systemTheme);
      return;
    }

    root.classList.add(theme);
    setData(storageKey, theme);
  }, [theme, storageKey]);

  return (
    <ThemeContext value={{ theme, setTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext>
  );
}

export function useTheme() {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
