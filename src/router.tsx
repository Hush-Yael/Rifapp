import { createRouter as createTanStackRouter } from "@tanstack/solid-router";
import { routeTree } from "~/routeTree.gen";
import { QueryClient } from "@tanstack/solid-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/solid-router-ssr-query";
import NotFound from "~/components/NotFound";
import ErrorComponent from "~/components/Error";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    routeTree,

    context: {
      queryClient,
    },

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorComponent,
    defaultNotFoundComponent: NotFound,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
