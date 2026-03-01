import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import UnoCSS from "unocss/vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import solidPlugin from "vite-plugin-solid";
import { nitro } from "nitro/vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
  plugins: [
    lucidePreprocess(),
    devtools(),
    nitro(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    UnoCSS(),
    tanstackStart(),
    solidPlugin({ ssr: true }),
  ],
});
