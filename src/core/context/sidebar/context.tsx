import type { Accessor, Setter } from "solid-js";
import { createContext } from "solid-js";

export type SideBarContextProps = {
  sidebarOpen: Accessor<boolean>;
  sidebarFixed: Accessor<boolean>;
  setSidebarOpen: Setter<boolean>;
};

const sideBarContext = createContext<SideBarContextProps | undefined>(
  undefined,
);
export default sideBarContext;
