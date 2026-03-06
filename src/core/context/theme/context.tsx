import { createContext, type Accessor } from "solid-js";
import type { Theme } from "~/core/lib/theme";

type ThemeContextProps = {
  theme: Accessor<Theme>;
  setTheme: (theme: Theme) => void;
};

export default createContext<ThemeContextProps | undefined>(undefined);
