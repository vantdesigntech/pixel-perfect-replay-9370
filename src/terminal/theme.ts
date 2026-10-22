import { useEffect, useState } from "react";

export type ThemeName = "mono" | "neon";
const KEY = "terminal-theme";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>("mono");
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "mono" || saved === "neon") setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.dataset["theme"] = theme;
    localStorage.setItem(KEY, theme);
  }, [theme]);
  return [theme, setTheme] as const;
}

/** Reads resolved CSS variables so canvas charts follow the active theme. */
export function readChartColors() {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return {
    bg: v("--panel"), text: v("--text-dim"), grid: v("--grid"), border: v("--border"),
    up: v("--up"), down: v("--down"), highlight: v("--highlight"), upWick: v("--up"), downWick: v("--down"),
  };
}
