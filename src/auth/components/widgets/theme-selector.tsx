import { useTheme } from "~/core/context/theme/provider";
import { THEMES, type Theme } from "~/core/lib/theme";
import { SegmentedControl } from "@kobalte/core/segmented-control";
import { For } from "solid-js";
import { useHydrated } from "@tanstack/solid-router";
import { ThemeIconMatch } from "~/core/components/icons";

export default function ThemeSelector() {
  const themeOptions = Object.entries(THEMES) as [Theme, string][];
  const { theme, setTheme } = useTheme();
  const isHydrated = useHydrated();

  return (
    <SegmentedControl
      value={theme()}
      options={themeOptions}
      // @ts-expect-error: el valor es un tema correcto
      onChange={setTheme}
      disabled={!isHydrated()}
    >
      <SegmentedControl.Label class="sr-only">
        Seleccionar tema del sitio
      </SegmentedControl.Label>

      <div role="presentation" class="ui-seg-list">
        <For each={themeOptions}>
          {([value, label]) => (
            <SegmentedControl.Item value={value}>
              <SegmentedControl.ItemInput class="peer sr-only" />

              <SegmentedControl.ItemLabel class="ui-seg-item size-6.5">
                <span class="sr-only">{label}</span>
                <ThemeIconMatch option={value} current={theme() === value} />
              </SegmentedControl.ItemLabel>
            </SegmentedControl.Item>
          )}
        </For>
      </div>
    </SegmentedControl>
  );
}
