
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = "light" | "dark";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string; // To match next-themes API for class attribute
  enableSystem?: boolean; // To match next-themes API, though not fully implemented here for simplicity
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: Theme; // Actual theme being applied (handles 'system' if implemented)
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "ui-theme",
  attribute = "class", // typically "class" for adding 'dark' or 'light' to html tag
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
        setThemeState(storedTheme);
      } else {
         // If defaultTheme is 'system', this is where system preference logic would go.
         // For now, it just falls back to the passed defaultTheme.
        setThemeState(defaultTheme);
      }
    } catch (e) {
      // localStorage is not available
      setThemeState(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    if (!mounted) return; // Don't run on server or before client mount is confirmed by first useEffect

    const root = window.document.documentElement;
    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    } else {
      root.setAttribute(attribute, theme);
    }
    try {
      localStorage.setItem(storageKey, theme);
    } catch (e) {
      // localStorage is not available
    }
  }, [theme, attribute, storageKey, mounted]);


  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  // In a more complex provider, resolvedTheme would handle 'system'. Here, it's same as theme.
  const resolvedTheme = theme; 

  // The Provider must always be rendered for useTheme to work.
  // The `theme` will be `defaultTheme` on SSR/initial client render,
  // then updated by the useEffect. Hydration warnings are suppressed at the HTML tag level.
  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
