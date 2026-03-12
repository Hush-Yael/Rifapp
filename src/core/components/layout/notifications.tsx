import { Popover } from "@kobalte/core/popover";
import { MdOutlineNotifications, MdSharpNotifications } from "solid-icons/md";
import { useContext } from "solid-js";
import sideBarContext from "~/core/context/sidebar/context";

export default function Notifications() {
  const { sidebarFixed } = useContext(sideBarContext)!;

  return (
    <Popover placement={sidebarFixed() ? "left-end" : undefined}>
      <Popover.Trigger class="ui-sidebar-menu-trigger group">
        <span class="ui-sidebar-menu-trigger-icon-container">
          <MdOutlineNotifications />
          <MdSharpNotifications />
        </span>

        <span class="max-sidebar_full:sr-only">Notificaciones</span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          class="ui-popover p-2 px-3 text-sm"
          data-origin-horizontal={sidebarFixed() ? "" : undefined}
        >
          <Popover.Arrow class="ui-popover-arrow" />
          Nada que mostrar... por ahora
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
