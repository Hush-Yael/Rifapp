import {
  type ParentProps,
  useContext,
  createEffect,
  createSignal,
} from "solid-js";
import ThemeContext from "./context";
import {
  setStoredTheme,
  handleThemeChange,
  setupPreferredMedia,
  themeScript,
  getStoredTheme,
  type Theme,
  themeValidator,
  cleanupPreferredMedia,
} from "~/core/lib/theme";
import { ScriptOnce } from "@tanstack/solid-router";

export function ThemeProvider(props: ParentProps) {
  const [theme, _setTheme] = createSignal<Theme>(getStoredTheme());
  let media: MediaQueryList | undefined;

  createEffect(() => {
    if (media === undefined)
      media = window.matchMedia("(prefers-color-scheme: dark)");

    if (theme() !== "system") cleanupPreferredMedia(media);
    else return setupPreferredMedia(media);
  });

  /** Parses given theme, stores given value and changes root class */
  const setTheme = (newTheme: Theme) => {
    const validatedTheme = themeValidator.parse(newTheme);
    _setTheme(validatedTheme);
    setStoredTheme(validatedTheme);
    handleThemeChange(validatedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ScriptOnce children={themeScript} />
      {props.children}
    </ThemeContext.Provider>
  );
}

/** Hook to access theme from context */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
