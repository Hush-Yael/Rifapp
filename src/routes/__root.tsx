import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { HydrationScript } from "solid-js/web";
import { Suspense } from "solid-js";
import "virtual:uno.css";
import indexCss from "~/index.css?url";

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { title: "Rifapp" },
      { name: "charset", content: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "theme-color", content: "hsl(43.5874 95.7082% 54.3137%)" },
    ],
    links: [{ rel: "stylesheet", href: indexCss }],
  }),
  shellComponent: RootComponent,
});

function RootComponent() {
  return (
    <html lang="es">
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        <Suspense>
          <Outlet />
          <TanStackRouterDevtools />
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
