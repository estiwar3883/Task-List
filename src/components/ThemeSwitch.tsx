"use client";

import { Switch } from "@heroui/react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const storageKey = "task-list-theme";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
};

export const ThemeSwitch = () => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Switch
      size="sm"
      isSelected={isDark}
      onChange={(selected) => {
        const nextTheme = selected ? "dark" : "light";

        window.localStorage.setItem(storageKey, nextTheme);
        setTheme(nextTheme);
      }}
      className="theme-switch"
      aria-label="Cambiar entre modo claro y oscuro"
    >
      {isDark ? "Oscuro" : "Claro"}
    </Switch>
  );
};
