import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";
import authClient from "~/auth/lib/client";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Link } from "@tanstack/solid-router";
import ThemeSelector from "~/auth/components/widgets/theme-selector";

export const Route = createFileRoute("/(auth)/_redir-to-dashboard")({
  validateSearch: zodValidator(
    z.object({
      redirect: z.string().optional(),
    }),
  ),
  beforeLoad: async () => {
    if (import.meta.env.PROD) {
      const session = await authClient.getSession();
      if (session) throw redirect({ to: "/dashboard", replace: true });
    }
  },
  component,
});

function component() {
  const linkClass =
    "fc min-w-max p-1 px-2 border-[--shaded] rounded-lg transition-colors not-[[aria-current=page]]:(text-muted-text pover:bg-muted) aria-[current=page]:(border-1 font-500 bg-muted)";

  return (
    <main
      class="
          col aic gap-y-4 ma w-90% max-w-450px
          before:(
            content-[''] fixed -z-1 inset-0 size-full bg-[linear-gradient(to_right,var(--shaded)_1px,_transparent_1px),linear-gradient(to_bottom,var(--shaded)_1px,_transparent_1px)] bg-size-[20px_30px] mask-[radial-gradient(ellipse_70%_60%_at_50%_100%,_#000_60%,_transparent_100%)]
          )
      "
    >
      <div class="flex aic jb gap-x-4 w-full">
        <nav>
          <ul class="ui-card flex aic gap-x-2 p-2 rounded-lg  max-[500px]:text-sm *:flex-1">
            <li>
              <Link class={linkClass} to="/login">
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link class={linkClass} to="/signup">
                Registro
              </Link>
            </li>
          </ul>
        </nav>
        <ThemeSelector />
      </div>

      <div class="max-w-md w-full">
        <Outlet />
      </div>
    </main>
  );
}
