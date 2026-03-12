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

export default function Navbar() {
  const { sidebarOpen, sidebarFixed } = useContext(sideBarContext)!;

  return (
    <nav
      id="sidebar"
      class="z-5 top-0 left-0 flex-1 text-sidebar-text transition-[opacity,transform] duration-250 max-sidebar:(fixed size-full max-w-70dvw p-2.5 bg-[--base] aria-hidden:(pointer-events-none opacity-0 -translate-x-full)) sidebar:(w-full py-6)"
      aria-hidden={!sidebarOpen() && !sidebarFixed()}
      inert={!sidebarOpen() && !sidebarFixed()}
    >
      <ul class="col gap-y-1 sidebar:gap-y-2">
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
    </nav>
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
            aria-[current=page]:(ui-primary pover:bg-primary/80 shadow-[--primary-shadow])
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
