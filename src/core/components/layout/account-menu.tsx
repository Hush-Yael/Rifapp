import { AiOutlineSetting } from "solid-icons/ai";
import authClient from "~/auth/lib/client";
import toast from "../widgets/toast";
import { MdRoundExit_to_app } from "solid-icons/md";
import { useRouter, useRouteContext } from "@tanstack/solid-router";
import { Show, useContext } from "solid-js";
import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { FaRegularUserCircle, FaSolidCircleUser } from "solid-icons/fa";
import sideBarContext from "~/core/context/sidebar/context";

export default function AccountMenu() {
  const router = useRouter();
  const user = useRouteContext({
    from: "/_authed",
    select: (s) => s.user,
  });
  const { sidebarFixed } = useContext(sideBarContext)!;

  return (
    <DropdownMenu placement={sidebarFixed() ? "left-end" : undefined}>
      <DropdownMenu.Trigger class="ui-sidebar-menu-trigger group">
        <Show
          when={user().image}
          fallback={
            <span class="ui-sidebar-menu-trigger-icon-container">
              <FaRegularUserCircle />
              <FaSolidCircleUser />
            </span>
          }
        >
          <img
            src={user().image!}
            class="size-7 rounded-full object-cover sidebar_full:-ml-0.5"
            alt="user"
          />
        </Show>

        <span class="truncate max-sidebar_full:sr-only">
          {user().name || "Desconocido"}
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          class="ui-popover col gap-y-1 py-2 px-2 text-sm"
          data-origin-horizontal={sidebarFixed() ? "" : undefined}
        >
          <DropdownMenu.Arrow class="ui-popover-arrow" />

          <hgroup class="px-1">
            <Show
              when={user().displayUsername}
              fallback={<i>Sin nombre de usuario</i>}
            >
              <h3 class="font-500">
                <span class="text-indigo-600 dark:text-indigo mr-1 font-bold">
                  @
                </span>
                {user().displayUsername || user().username}
              </h3>
            </Show>
            <h4 class="text-muted-text">{user().email}</h4>
          </hgroup>

          <DropdownMenu.Separator class="border-border m-1" />

          <DropdownMenu.Item
            class="ui-menu-item ui-menu-item/neutral p-1 px-2"
            // oxlint-disable-next-line typescript/no-misused-promises
            onClick={() => router.navigate({ to: "/settings" })}
          >
            <AiOutlineSetting class="size-4" />
            Configuraciones
          </DropdownMenu.Item>

          <DropdownMenu.Item
            class="ui-menu-item ui-menu-item/danger p-1 px-2"
            onClick={() =>
              toast.promise(authClient.signOut(), {
                onLoading: "Cerrando sesión",
                onSuccess: () => {
                  queueMicrotask(() => {
                    router.invalidate();
                  });
                  return "Sesión cerrada";
                },
                onError: "No se pudo cerrar la sesión",
              })
            }
          >
            <MdRoundExit_to_app class="size-4" />
            Cerrar sesión
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}
