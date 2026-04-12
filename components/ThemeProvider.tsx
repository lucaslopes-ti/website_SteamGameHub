"use client";

import { createContext, useContext, useEffect, ReactNode, useMemo } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const theme: Theme = "dark";
  const value = useMemo<ThemeContextType>(() => ({ theme, toggleTheme: () => {} }), [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");
    localStorage.removeItem("theme");
  }, []);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
