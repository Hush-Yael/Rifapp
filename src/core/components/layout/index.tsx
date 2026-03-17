import { Outlet } from "@tanstack/solid-router";
import Logo, { LogoShape } from "../logo";
import { useContext } from "solid-js";
import ThemeSelector from "./theme-selector";
import AccountMenu from "./account-menu";
import Notifications from "./notifications";
import Navbar from "./navbar";
import SidebarProvider from "~/core/context/sidebar/provider";
import sideBarContext from "~/core/context/sidebar/context";

export default function Layout() {
  return (
    <SidebarProvider>
      <div
        class="col flex-1 bg-sidebar sidebar:p-2"
        style={{
          "--nav-w": "40px",
          "--nav-full-w": "200px",
          "--header-h": "56px",
        }}
      >
        <Sidebar />

        <main
          class={`
            relative col p-4 flex-1 bg-[--base] col-start-2 transition-[margin] squircle duration-250
            max-sidebar:(border-t border-[--shaded] rounded-t-3xl shadow-[0_-2px_4px_rgba(0,0,0,0.0125)])
            sidebar:(
              ml-[calc(var(--nav-w)+var(--spacing)*5)] px-6 rounded-2xl shadow
              dark:(shadow-[inset_0_1px_1px_#fff1,0_2px_2px_#0002,0_4px_4px_#0001])
            )
            sidebar_full:ml-[calc(var(--nav-full-w)+var(--spacing)*5)]
          `}
        >
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useContext(sideBarContext)!;

  return (
    <aside
      class={`
        flex gap-x-4 h-[--header-h] transition-[width] duration-250
        max-sidebar:(z-1 jb pl-3 pr-2)
        sidebar:(fixed left-3 top-3 mb-3 flex-col h-[calc(100%-var(--spacing)*3)] w-[--nav-w] py-2) max-sidebar_full:aic
        sidebar_full:(py-5 w-[--nav-full-w])
      `}
    >
      {/* backdrop */}
      <div
        class="fixed inset-0 z-4 bg-[#0002] dark:bg-[#0004] transition-opacity duration-250 not-[[data-hidden]]:(size-full) data-[hidden]:(pointer-events-none opacity-0) sidebar:hidden"
        bool:data-hidden={!sidebarOpen()}
      />

      <Logo class="h-5.5 sidebar:max-sidebar_full:hidden sidebar_full:(h-6 ml-3 mb-6)" />

      <LogoShape class="size-8 mb-6 hidden sidebar:max-sidebar_full:block" />

      <div class="flex gap-2 sidebar:(flex-col w-full py-2 border-[--shaded-2] dark:border-[--shaded] border-y) max-sidebar_full:aic">
        <ThemeSelector />

        <Notifications />

        <AccountMenu />

        <button
          class={`group col gap-y-1.5 aic jcc h-6 w-12 sidebar:hidden [&>span]:(h-[2px] w-1/2 bg-current transition-[transform,opacity] duration-250) `}
          onClick={() => setSidebarOpen(!sidebarOpen())}
          aria-haspopup="menu"
          aria-label="Abrir menú"
          aria-expanded={sidebarOpen()}
        >
          <span class="group-aria-expanded:(rotate-45 translate-y-2)" />
          <span class="group-aria-expanded:opacity-0" />
          <span class="group-aria-expanded:(-rotate-45 -translate-y-2)" />
        </button>
      </div>

      <Navbar />
    </aside>
  );
}
