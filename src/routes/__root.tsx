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

if (import.meta.env.DEV && !("sleep" in Promise))
  Object.defineProperty(Promise, "sleep", {
    value: <T,>(time: number, data?: T) =>
      new Promise((res) => setTimeout(() => res(data), time)),
  });

declare global {
  interface PromiseConstructor {
    sleep<T>(time: number, data?: T): Promise<T>;
  }
}

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { title: "Rifapp" },
      { name: "charset", content: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "theme-color", content: "hsl(43.5874 95.7082% 54.3137%)" },
    ],
    links: [{ rel: "stylesheet", href: indexCss }],
    scripts: import.meta.env.DEV
      ? [
          {
            type: "module",
            children: `
              if (
                /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|webOS/i.test(
                  navigator.userAgent
                ) ||
                "ontouchstart" in window ||
                navigator.maxTouchPoints > 0
              ) {
                await import("/node_modules/eruda/eruda.js");

                // @ts-expect-error: eruda se añade a window
                if (window.eruda) window.eruda.init();
                else throw new Error("eruda not found");
              }
            `,
          },
        ]
      : undefined,
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
