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
    "fc gap-x-2 transition-[background-color,color,opacity,transform,border-color,outline-color] cursor-pointer select-none disabled:cursor-not-allowed",

  ["ui-btn/primary"]:
    "squircle rounded-[16px] font-600 tracking-wide bg-primary pover:bg-primary/80 border-1 border-[#0002] text-primary-text shadow-[--primary-shadow] outline-accent disabled:opacity-50 disabled:active:(animate-head-shake animate-iteration-6) focus-visible:(scale-101 -translate-y-0.5)",

  ["ui-btn/secondary"]:
    "squircle rounded-[16px] font-600 tracking-wide bg-secondary pover:bg-secondary/80 text-secondary-text",
};

const input = {
  ["ui-input/on-card"]: `
      border border-border bg-muted text-muted-text py-1 px-2 shadow-[inset_0_2px_#fffa] dark:shadow-[inset_0_2px_2px_#0002] outline-accent transition-[colors,opacity]
      autofilled:text-fill-muted-text autofilled:focus:text-fill-muted-text autofilled:[&_input]:text-fill-muted-text autofilled:caret-base-text autofilled:[&_input]:caret-base-text
      autofilled:webkit-shadow-[inset_0_2px_#fffa,0_0_0_400px_var(--muted)_inset] dark:autofilled:webkit-shadow-[inset_0_2px_2px_#0002,0_0_0_400px_var(--muted)_inset]
      [&[aria-invalid=true],&[data-invalid]]:(border-danger outline-danger shadow-none)
    `,

  ["ui-password-container"]:
    // oxlint-disable-next-line no-useless-escape
    "flex aic jb gap-2 focus-within:outline-2",

  ["ui-input/on-password-container"]: "px-2 w-full outline-0",

  ["ui-password-container/on-card"]: "py-1! pl-0! pr-1.5!",

  ["ui-input-error/on-card"]: "text-sm text-danger-display",

  ["ui-select-list"]: "col gap-y-1 p-1.5",

  ["ui-select-item"]: `
    p-1 px-3
    [&[data-highlighted]]:not-[[data-selected],[data-checked]]:(bg-muted)
    [&[data-selected],&[data-checked]]:(ui-primary font-500 hover:bg-primary/80 data-[highlighted]:bg-primary/80)
  `,

  ["ui-seg-list"]: "ui-card flex gap-x-1 p-1 px-1.75 rounded-full",

  ["ui-seg-item"]: `
    fc gap-x-2 rounded-full select-none transition-[background-color,outline-color,color] outline-(1 transparent offset-1)
    peer-disabled:(opacity-50 cursor-not-allowed)
    peer-not-checked:text-muted-text
    peer-checked:(ui-primary shadow-[--primary-shadow])
    peer-focus-visible:outline-accent
    peer-not-[:checked,:disabled]:pover:bg-muted
  `,
};

const elems = {
  ["ui-card"]: "bg-card text-card-text rounded-card shadow-[--card-shadow]",

  ["ui-link/primary"]:
    "underline underline-offset-2 underline-primary pover:underline-2 font-500",

  ["ui-popover"]: `
    bg-popover rounded-popover shadow-[--popover-shadow] transform-origin-[var(--kb-select-content-transform-origin)] animate-[content-hide-vertical_.2s_ease-in-out_forwards]

    data-[expanded]:animate-[content-show-vertical_.2s_ease-in-out]
    
    data-[origin-horizontal]-(
      animate-[content-hide-horizontal_.2s_ease-in-out_forwards]
      data-[expanded]:animate-[content-show-horizontal_.2s_ease-in-out]
    )
  `,

  ["ui-popover-arrow"]:
    "flex text-popover [&_svg]:filter-drop-shadow[0px_-3px_6px_#0002] dark:text-[#373636]",

  ["ui-menu-item"]:
    "flex aic gap-x-2 w-full rounded-[16px] squircle select-none transition-colors hover:outline-none",

  ["ui-menu-item/neutral"]: "pover:bg-muted",

  ["ui-menu-item/danger"]: "pover:bg-danger-display/10 text-danger-display",

  ["ui-sidebar-menu-trigger"]: `
  group flex aic gap-x-2 border border-transparent transition-colors text-sidebar-text
  pover:bg-sidebar-highlight
  
    data-[expanded]:(
      bg-sidebar-highlight border-[--shaded-2] shadow-[inset_0_2px_#fff3]
      dark:shadow-[inset_0_1px_1px_#fff2,inset_0_-1px_2px_#0004,0_4px_4px_#0002]
    )

    max-sidebar_full:(jcc size-9 rounded-full)
    sidebar_full:(py-1 px-2 rounded-lg dark:data-[expanded]:border-[--shaded])
    `,

  ["ui-sidebar-menu-trigger-icon-container"]: `
    relative size-6
    [&>svg]:(absolute inset-0 size-6 transition-[transform,opacity])
    group-[[data-expanded]]:[&>svg:first-child]:(scale-80 opacity-0)
    group-[[data-closed]]:[&>svg:last-child]:(scale-0 opacity-0)
  `,
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
    "w-[6px] rounded text-bottom-to-top bg-[--shaded-2]",

  ["ui-toast-progress-fill"]:
    "w-full h-[var(--kb-toast-progress-fill-width)] rounded-b bg-accent",

  ["ui-toast-close-btn"]:
    "fc mla size-max float-right rounded-full p-0.5 text-muted-text pover:bg-[--shaded-2]",
};

const shortcuts = {
  ...util,
  ...colors,
  ...btn,
  ...elems,
  ...input,
  ...toast,
} satisfies UserShortcuts<ConfigThemePreset>;

export default shortcuts;
