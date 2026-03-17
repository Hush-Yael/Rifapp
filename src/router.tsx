import { createRouter as createTanStackRouter } from "@tanstack/solid-router";
import { routeTree } from "~/routeTree.gen";
import { QueryClient } from "@tanstack/solid-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/solid-router-ssr-query";
import NotFound from "~/core/components/NotFound";
import ErrorComponent from "~/core/components/Error";
import Spinner from "./shared/components/widgets/loaders/spinner";

export function getRouter() {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    routeTree,
    defaultPendingMs: 500,

    context: {
      queryClient,
    },

    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ErrorComponent,
    defaultNotFoundComponent: NotFound,
    defaultPendingComponent: () => (
      <div
        role="status"
        class="ui-card absolute inset-0 flex gap-x-3 ma size-max p-4 px-6"
      >
        <Spinner class="size-5 text-accent mt-0.5" />

        <hgroup>
          <h1 class="font-bold">Cargando contenido...</h1>
          <p class="text-muted-text text-sm">Por favor, espere.</p>
        </hgroup>
      </div>
    ),
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
