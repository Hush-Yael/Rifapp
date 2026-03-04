import type { UserShortcuts } from "unocss";
import type { ConfigThemePreset } from "../uno.config";

const util = {
  col: "flex flex-col",
  fc: "flex items-center justify-center",
};

const colors = {
  ["ui-primary"]: "bg-primary text-primary-text",
  ["ui-secondary"]: "bg-secondary text-secondary-text",
};

const btn = {
  ["ui-btn"]:
    "fc gap-x-2 transition-[background-color,color,opacity,transform,border-color,outline-color]  duration-200 ease-in-out cursor-pointer select-none disabled:cursor-not-allowed",

  ["ui-btn/primary"]:
    "squircle rounded-[16px] font-600 tracking-wide bg-primary pover:bg-primary/80 border-1 border-[#0002] text-primary-text shadow-[inset_0_2px_0px_#fff3,0_1px_4px_#0002] dark:shadow-[inset_0_2px_0px_#fff4,_0_1px_4px_#0008]",

  ["ui-btn/secondary"]:
    "squircle rounded-[16px] font-600 tracking-wide bg-secondary pover:bg-secondary/80 text-secondary-text",
};

const elems = {
  ["ui-card"]: "bg-card text-card-text rounded-card shadow-[--card-shadow]",
};

const toast = {
  ["ui-toast"]: `
    flex gap-x-3 rounded-lg p-2 bg-card shadow-[--card-shadow]
    data-[opened]:animate-[toast-slide-in_200ms_cubic-bezier(0.16,_1,_0.3,_1)]!
    data-[closed]:animate-[content-hide-vertical_200ms_ease-in]!
    data-[swipe=move]:transform-translate-y-[var(--kb-toast-swipe-move-y)]
    data-[swipe=cancel]:transform-translate-y-[0]
    data-[swipe=cancel]:transition-transform
    data-[swipe=end]:animate-[toast-swipe-out_150ms_cubic-bezier(0.4,_0,_0.2,_1)]
  `,

  ["ui-toast/promise"]: `
      [&[data-state=fulfilled]_.ui-toast-progress-fill]:bg-success
      [&[data-state=fulfilled]_.ui-toast-progress-track]:bg-success/20
      dark:[&[data-state=fulfilled]_.ui-toast-progress-track]:bg-success/30
      [&[data-state=fulfilled]_.ui-toast-icon]:text-success

      [&[data-state=rejected]_.ui-toast-progress-fill]:bg-danger
      [&[data-state=rejected]_.ui-toast-progress-track]:bg-danger/20
      dark:[&[data-state=rejected]_.ui-toast-progress-track]:bg-danger/30
      [&[data-state=rejected]_.ui-toast-icon]:text-danger
      [&[data-state=rejected]_.ui-toast-icon]:scale-115
    `,

  ["ui-toast/success"]:
    "[&_.ui-toast-progress-fill]:bg-success [&_.ui-toast-progress-track]:bg-success/20 dark:[&_.ui-toast-progress-track]:bg-success/30 [&_.ui-toast-icon]:text-success",

  ["ui-toast/error"]:
    "[&_.ui-toast-progress-fill]:bg-danger [&_.ui-toast-progress-track]:bg-danger/20 dark:[&_.ui-toast-progress-track]:bg-danger/30 [&_.ui-toast-icon]:text-danger [&_.ui-toast-icon]:scale-115",

  ["ui-toast/info"]:
    "[&_.ui-toast-progress-fill]:bg-info [&_.ui-toast-progress-track]:bg-info/20 dark:[&_.ui-toast-progress-track]:bg-info/30 [&_.ui-toast-icon]:text-info",

  ["ui-toast/warning"]:
    "[&_.ui-toast-progress-fill]:bg-warning [&_.ui-toast-progress-track]:bg-warning/20 dark:[&_.ui-toast-progress-track]:bg-warning/30 [&_.ui-toast-icon]:text-warning",

  ["ui-toast-content"]:
    "flex jcc gap-x-2.5 flex-1 text-sm [&>svg]:(size-4.5 translate-y-0.5)",

  ["ui-toast-title"]: "font-600",

  ["ui-toast-description"]: "",

  ["ui-toast-progress-track"]:
    "w-[6px] rounded text-bottom-to-top bg-[--translucent-2]",

  ["ui-toast-progress-fill"]:
    "w-full h-[var(--kb-toast-progress-fill-width)] rounded-b bg-accent",

  ["ui-toast-close-btn"]:
    "fc mla size-max float-right rounded-full p-0.5 text-muted-text pover:bg-[--translucent-2]",
};

const shortcuts = {
  ...util,
  ...colors,
  ...btn,
  ...elems,
  ...toast,
} satisfies UserShortcuts<ConfigThemePreset>;

export default shortcuts;
