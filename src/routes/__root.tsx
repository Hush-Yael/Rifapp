import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { HydrationScript, Portal } from "solid-js/web";
import { Show, Suspense } from "solid-js";
import "virtual:uno.css";
import indexCss from "~/core/index.css?url";
import animCss from "~/core/anim.css?url";
import { ThemeProvider } from "~/core/context/theme/provider";
import { useHydrated } from "@tanstack/solid-router";
import LinearLoader from "~/shared/components/widgets/loaders/linear";
import { Toast } from "@kobalte/core/toast";

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
      { title: import.meta.env.VITE_APP_NAME },
      { name: "charset", content: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "theme-color", content: "hsl(43.5874 95.7082% 54.3137%)" },
    ],
    links: [
      { rel: "stylesheet", href: indexCss },
      { rel: "stylesheet", href: animCss },
    ],
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
  const isHydrated = useHydrated();

  return (
    <html lang="es">
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />

        <Show when={!isHydrated()}>
          <LinearLoader />
        </Show>

        <ThemeProvider>
          <Suspense>
            <Outlet />
          </Suspense>

          <Portal>
            <Toast.Region
              swipeDirection="down"
              translations={{
                notifications: (hotkeyPlaceholder: string) =>
                  `Notificaciones (${hotkeyPlaceholder})`,
              }}
            >
              <Toast.List class="col gap-2 z-15 fixed bottom-3 left-0 right-0 w-90% max-w-400px max-[600px]:mx-auto min-[600px]:(mla right-4)" />
            </Toast.Region>
          </Portal>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
