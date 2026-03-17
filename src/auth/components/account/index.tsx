import { Tabs } from "@kobalte/core/tabs";
import DataTab from "./tabs/data";
import ChangePasswordTab from "./tabs/change-password";
import SessionsTab from "./tabs/sessions";
import useMedia from "~/shared/hooks/useMedia";

export type TabValue = "change-password" | "data" | "sessions";

export default function Account() {
  const c = `
    relative select-none transition-colors
    not-[[data-selected]]:(text-muted-text pover:bg-[--shaded])
    data-[selected]:(font-500 bg-primary/20 dark:bg-[--shaded])
    max-sidebar_full:(p-1.5 px-4)
    sidebar_full:(text-left p-2 pl-3 pr-5)
  `;

  const mediaMatches = useMedia("(min-width: 1000px)");

  return (
    <Tabs
      class="flex flex-col gap-6 flex-1 sidebar_full:(flex-row -ml-2)"
      defaultValue={"data" satisfies TabValue}
      activationMode="manual"
      orientation={mediaMatches() ? "vertical" : "horizontal"}
    >
      <Tabs.List class="relative flex border-[--shaded] max-[500px]:text-sm max-sidebar_full:border-b sidebar_full:(flex-col border-r)">
        <Tabs.Trigger class={c} value={"data" satisfies TabValue}>
          Datos
        </Tabs.Trigger>

        <Tabs.Trigger class={c} value={"change-password" satisfies TabValue}>
          Cambiar contraseña
        </Tabs.Trigger>

        <Tabs.Trigger class={c} value={"sessions" satisfies TabValue}>
          Sesiones
        </Tabs.Trigger>
        <Tabs.Indicator class="absolute bg-primary transition-transform max-sidebar_full:(bottom-[-1px] h-[2px]) sidebar_full:(-left-[1px] w-[2px])" />
      </Tabs.List>

      <DataTab />
      <ChangePasswordTab />
      <SessionsTab />
    </Tabs>
  );
}

export function AccountLoader() {
  return (
    <div role="status" aria-label="Cargando contenido...">
      <div class="flex flex-col gap-6 flex-1 sidebar_full:(flex-row -ml-2)">
        {/* tabs */}
        <div class="flex gap-1 border-[--shaded] max-sidebar_full:border-b sidebar_full:(flex-col border-r min-w-[200px]) *:h-25px *:w-100px *:bg-[--shaded-2] *:animate-pulse sidebar_full:*:w-full">
          <div />
          <div />
          <div />
        </div>

        <div class="col gap-y-6 sidebar:(max-w-900px w-full mxa)">
          {/* title */}
          <div class="col gap-1 border-b border-[--shaded] pb-2 *:h-40px *:rounded *:bg-[--shaded-2] *:animate-pulse *:rounded">
            <div />
            <div />
          </div>

          {/* tab content */}
          <div class="flex-1 col gap-6 *:bg-[--shaded-2] *:animate-pulse *:h-150px *:rounded">
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}
