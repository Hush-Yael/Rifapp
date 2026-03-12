import { Select } from "@kobalte/core/select";
import { type Theme, THEMES } from "~/core/lib/theme";
import { useTheme } from "~/core/context/theme/provider";
import sideBarContext from "~/core/context/sidebar/context";
import { useContext } from "solid-js";
import { ThemeIconMatch } from "../icons";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { sidebarFixed } = useContext(sideBarContext)!;

  return (
    <Select<Theme>
      value={theme()}
      options={Object.keys(THEMES) as unknown as Theme[]}
      onChange={(theme) => setTheme(theme!)}
      disallowEmptySelection
      itemComponent={({ item }) => (
        <Select.Item item={item} class="ui-menu-item ui-select-item">
          <ThemeIconMatch
            option={item.rawValue}
            class="size-4.5"
            current={theme() === item.rawValue}
          />

          <span>{THEMES[item.rawValue] || item.rawValue}</span>
        </Select.Item>
      )}
      placement={sidebarFixed() ? "left-end" : "top-start"}
      gutter={sidebarFixed() ? undefined : -3}
    >
      <Select.Trigger class="ui-sidebar-menu-trigger group sidebar_full:w-full">
        <Select.Value<Theme> class="flex items-center gap-x-2">
          {({ selectedOption }) => {
            const option = selectedOption();

            return (
              <>
                <span class="ui-sidebar-menu-trigger-icon-container">
                  <ThemeIconMatch option={option} />
                  <ThemeIconMatch option={option} current />
                </span>

                <span class="sr-only">{THEMES[option] || option}</span>
                <span class="hidden sidebar_full:block" aria-hidden>
                  Tema del sitio
                </span>
              </>
            );
          }}
        </Select.Value>
      </Select.Trigger>

      <Select.Label class="sr-only">Tema del sitio</Select.Label>

      <Select.Portal>
        <Select.Content
          class="ui-popover"
          data-origin-horizontal={sidebarFixed() ? "" : undefined}
        >
          <Select.Arrow class="ui-popover-arrow" />
          <Select.Listbox class="ui-select-list" />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}
