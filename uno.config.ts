import {
  defineConfig,
  presetWind4,
  transformerVariantGroup,
  type ConfigBase,
  type PresetWind4Theme,
} from "unocss";

import theme from "./unocss/theme";
import shortcuts from "./unocss/shortcuts";
import rules from "./unocss/rules";
import variants from "./unocss/variants";

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
  ],
  extendTheme: theme,
  rules,
  variants,
  shortcuts,
  transformers: [transformerVariantGroup()],
});

export type ConfigThemePreset = PresetWind4Theme;
export type Config = ConfigBase<ConfigThemePreset>;
