import { type LinkProps } from "@tanstack/solid-router";
import { BsTicketDetailed, BsTicketDetailedFill } from "solid-icons/bs";
import {
  MdOutlineDashboard,
  MdSharpDashboard,
  MdOutlinePayments,
  MdFillPayments,
} from "solid-icons/md";
import { RiUserFacesGroupLine, RiUserFacesGroupFill } from "solid-icons/ri";
import { useContext, type ParentProps } from "solid-js";
import type { IconTypes } from "solid-icons";
import { Link } from "@tanstack/solid-router";
import { HoverCard } from "@kobalte/core/hover-card";
import sideBarContext from "~/core/context/sidebar/context";
import { Collapsible } from "@kobalte/core/collapsible";

export default function Navbar() {
  const { sidebarOpen, setSidebarOpen, sidebarFixed } =
    useContext(sideBarContext)!;

  return (
    <Collapsible
      open={sidebarOpen() || sidebarFixed()}
      onOpenChange={setSidebarOpen}
    >
      <Collapsible.Trigger
        id="toggleNavbarBtn"
        class={`
          group col gap-y-1.5 aic jcc h-6 w-12
          sidebar:hidden
          [&>span]:(h-[2px] w-1/2 bg-current transition-[transform,opacity] duration-250)
        `}
        aria-label="Abrir menú de navegación"
      >
        <span class="group-aria-expanded:(rotate-45 translate-y-2)" />
        <span class="group-aria-expanded:opacity-0" />
        <span class="group-aria-expanded:(-rotate-45 -translate-y-2)" />
      </Collapsible.Trigger>

      <Collapsible.Content
        as="nav"
        id="sidebar"
        class={`
          z-5 top-0 left-0 flex-1 text-sidebar-text duration-250
          max-sidebar:(
            fixed top-[--header-h] w-full p-2.5 bg-sidebar shadow-[0_2px_4px_#0002] border-t border-[--shaded] shadow-[0_4px_8px_#0001] overflow-hidden
            dark:(border-b border-[--shaded-2] shadow-[0_4px_18px_#000a])
            data-[closed]:(animate-[navbar-hide_100ms_ease-in] pointer-events-none)
            data-[expanded]:animate-[navbar-show_100ms_ease-in]
          )
          sidebar:(w-full py-6)
        `}
      >
        <ul
          class="col gap-y-1 sidebar:gap-y-2"
          onClick={({ target }) =>
            target.closest("a") &&
            // await closing animation
            setTimeout(() => setSidebarOpen(false), 150)
          }
        >
          <NavbarLink
            to="/dashboard"
            outlineIcon={MdOutlineDashboard}
            filledIcon={MdSharpDashboard}
          >
            Panel de control
          </NavbarLink>

          <NavbarLink
            to="/raffles"
            outlineIcon={BsTicketDetailed}
            filledIcon={BsTicketDetailedFill}
          >
            Rifas
          </NavbarLink>

          <NavbarLink
            to="/users"
            outlineIcon={RiUserFacesGroupLine}
            filledIcon={RiUserFacesGroupFill}
          >
            Usuarios
          </NavbarLink>

          <NavbarLink
            to="/payments"
            outlineIcon={MdOutlinePayments}
            filledIcon={MdFillPayments}
          >
            Pagos
          </NavbarLink>
        </ul>
      </Collapsible.Content>
    </Collapsible>
  );
}

type NavbarLinkProps = ParentProps &
  Pick<LinkProps, "to"> & {
    filledIcon: IconTypes;
    outlineIcon: IconTypes;
  };

export function NavbarLink(props: NavbarLinkProps) {
  return (
    <li>
      <HoverCard placement="left" openDelay={300}>
        <HoverCard.Trigger
          as={Link}
          to={props.to}
          class={`
            group flex aic gap-x-2 p-2 px-3 rounded-lg transition-colors
            border border-transparent
            not-[[aria-current=page]]:pover:(
              bg-sidebar-highlight border-[--shaded] shadow-[inset_0_2px_#fff3]
              dark:(shadow-[inset_0_1px_1px_#fff2,inset_0_-1px_2px_#0004,0_4px_4px_#0002])
            )
            aria-[current=page]:(ui-primary pover:bg-primary/80 shadow-[--filled-shadow])
            sidebar:max-sidebar_full:(jcc p-2)
          `}
        >
          <props.filledIcon class="size-5 group-not-[[aria-current=page]]:hidden" />
          <props.outlineIcon class="size-5 group-[[aria-current=page]]:hidden" />

          <span class="sidebar:max-sidebar_full:sr-only">{props.children}</span>
        </HoverCard.Trigger>

        <HoverCard.Portal>
          <HoverCard.Content
            class="ui-popover p-2 px-3 text-sm hidden sidebar:max-sidebar_full:block"
            data-origin-horizontal
          >
            <HoverCard.Arrow class="ui-popover-arrow" />
            {props.children}
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard>
    </li>
  );
}
