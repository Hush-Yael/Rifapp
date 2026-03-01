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
    "fc gap-x-2 rounded-field transition-[background-color,color,transform,border-color,outline-color] duration-200 ease-in-out cursor-pointer select-none",

  ["ui-btn/primary"]:
    "squircle font-600 tracking-wide bg-primary pover:bg-primary/80 text-primary-text",

  ["ui-btn/secondary"]:
    "squircle font-600 tracking-wide bg-secondary pover:bg-secondary/80 text-secondary-text",
};

const shortcuts = {
  ...util,
  ...colors,
  ...btn,
} satisfies UserShortcuts<ConfigThemePreset>;

export default shortcuts;
