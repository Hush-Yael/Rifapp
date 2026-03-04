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
    danger: {
      DEFAULT: "var(--danger)",
      display: "var(--danger-display)",
      text: "var(--on-danger)",
    },
    success: {
      DEFAULT: "var(--success)",
      text: "var(--on-success)",
    },
    info: {
      DEFAULT: "var(--info)",
      text: "var(--on-info)",
    },
    warning: {
      DEFAULT: "var(--warning)",
      text: "var(--on-warning)",
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
  radius: {
    ...theme.radius,
    card: "var(--card-radius)",
  },
});

export default theme;
