import { createEffect, createSignal, type ParentProps } from "solid-js";
import useMedia from "~/shared/hooks/useMedia";
import SidebarContext from "./context";

function SidebarProvider(props: ParentProps) {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const sidebarFixed = useMedia("(min-width: 768px)");

  const handleEscape = (e: KeyboardEvent) =>
    e.key === "Escape" && setSidebarOpen(false);

  const handleClickOutside = (e: MouseEvent) => {
    const $sidebar = document.getElementById("sidebar") as HTMLDivElement,
      $toggleNavbarBtn = document.getElementById(
        "toggleNavbarBtn",
      ) as HTMLButtonElement;

    if (
      !$toggleNavbarBtn?.contains(e.target as Node) &&
      !$sidebar?.contains(e.target as Node)
    )
      setSidebarOpen(false);
  };

  const cleanup = () => {
    window.removeEventListener("keydown", handleEscape);
    window.removeEventListener("mousedown", handleClickOutside);
  };

  createEffect(() => {
    if (sidebarOpen()) {
      window.addEventListener("keydown", handleEscape);
      window.addEventListener("mousedown", handleClickOutside);
    } else cleanup();

    return cleanup;
  });

  return (
    <SidebarContext.Provider
      value={{ sidebarOpen, setSidebarOpen, sidebarFixed }}
    >
      {props.children}
    </SidebarContext.Provider>
  );
}

export default SidebarProvider;
