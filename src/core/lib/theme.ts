import z from "zod";
import { createIsomorphicFn } from "@tanstack/solid-start";
import { createClientOnlyFn } from "@tanstack/solid-start";

export type Theme = "light" | "dark" | "system";

export const THEMES: Record<Theme, string> = {
  light: "claro",
  dark: "oscuro",
  system: "sistema",
} as const;

export const themeValidator = z
  .enum(Object.keys(THEMES) as unknown as [Theme, ...Theme[]])
  .catch("system");

const themeStorageKey = "theme";

/** Stores client theme in localStorage */
export const setStoredTheme = createClientOnlyFn((theme: Theme) => {
  const validatedTheme = themeValidator.parse(theme);
  localStorage.setItem(themeStorageKey, validatedTheme);
});

/** Changes root theme class based on client theme */
const changeRootThemeClass = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark", "system");

  if (theme === "system") {
    const systemTheme = getSystemTheme();
    root.classList.add(systemTheme, "system");
  } else root.classList.add(theme);
};

/** Handles client theme change using View Transition API */
export const handleThemeChange = createClientOnlyFn((theme: Theme) => {
  const validTheme = themeValidator.parse(theme);

  // oxlint-disable-next-line no-unused-expressions
  document.startViewTransition
    ? document.startViewTransition(() => {
        changeRootThemeClass(validTheme);
      })
    : changeRootThemeClass(validTheme);
});

/** Sets up a mediaQuery with its listener to detect system theme change. Calls `handleThemeChange` whenever it happens */
const preferredMediaHandler = () => handleThemeChange("system");

export const setupPreferredMedia = createClientOnlyFn(
  (media: MediaQueryList) => {
    media.addEventListener("change", preferredMediaHandler);
    return () => cleanupPreferredMedia(media);
  },
);

/** Cleans up mediaQuery listener */
export const cleanupPreferredMedia = createClientOnlyFn((media) => {
  media.removeEventListener("change", preferredMediaHandler);
});

/** Gets client theme from localStorage */
export const getStoredTheme = createIsomorphicFn()
  .server((): Theme => "system")
  .client((): Theme => {
    const stored = localStorage.getItem(themeStorageKey);
    return themeValidator.parse(stored);
  });

/** Get light or dark theme according to current system preference */
export const getSystemTheme = createIsomorphicFn()
  .server((): Theme => "light")
  .client((): Theme => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

/** Used for ScriptOnce component. Sets root theme class based on client theme when document is loaded */
export const themeScript = (function () {
  function themeFn() {
    const storedTheme: Theme = (localStorage.getItem("theme") ||
      "system") as Theme;
    const validTheme = ["light", "dark", "system"].includes(storedTheme)
      ? storedTheme
      : "system";

    const isDark =
      (validTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) ||
      validTheme === "dark";

    document.documentElement.classList.add(isDark ? "dark" : "light");
  }

  return `(${themeFn.toString()})();`;
})();
