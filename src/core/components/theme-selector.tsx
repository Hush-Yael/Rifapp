import { ClientOnly } from "@tanstack/solid-router";
import { For } from "solid-js";
import { useTheme } from "~/core/context/theme/provider";
import { type Theme, THEMES } from "~/core/lib/theme";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <ClientOnly fallback={null}>
      <select
        value={theme()}
        onChange={(e) => setTheme(e.target.value as Theme)}
      >
        <For each={THEMES}>
          {(t) => (
            <option selected={t === theme()} value={t}>
              {t}
            </option>
          )}
        </For>
      </select>
    </ClientOnly>
  );
}
