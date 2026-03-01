import type { ThemeExtender } from "unocss";
import type { ConfigThemePreset } from "../uno.config";

const theme: ThemeExtender<ConfigThemePreset> = (theme) => ({
  ...theme,
  colors: {
    base: {
      DEFAULT: "var(--base-background)",
      text: "var(--on-base)",
    },
    primary: {
      DEFAULT: "var(--primary)",
      text: "var(--on-primary)",
    },
    secondary: {
      DEFAULT: "var(--secondary)",
      text: "var(--on-secondary)",
    },
    accent: {
      DEFAULT: "var(--accent)",
      text: "var(--on-accent)",
    },
    popover: {
      DEFAULT: "var(--popover)",
      text: "var(--on-popover)",
    },
    card: {
      DEFAULT: "var(--card)",
      text: "var(--on-card)",
    },
    muted: {
      DEFAULT: "var(--muted)",
      text: "var(--on-muted)",
    },
    border: "var(--border)",
    sidebar: {
      DEFAULT: "var(--sidebar)",
      text: "var(--on-sidebar)",
    },
    sidebarHighlight: {
      DEFAULT: "var(--sidebar-highlight)",
      text: "var(--sidebar-on-highlight)",
    },
  },
});

export default theme;
