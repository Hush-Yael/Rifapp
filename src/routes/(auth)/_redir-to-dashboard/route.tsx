import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";
import authClient from "~/auth/lib/client";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Link } from "@tanstack/solid-router";

export const Route = createFileRoute("/(auth)/_redir-to-dashboard")({
  validateSearch: zodValidator(
    z.object({
      redirect: z.string().optional(),
    }),
  ),
  beforeLoad: async () => {
    if (import.meta.env.PROD) {
      const session = await authClient.getSession();

      if (session == null || session.data?.user == null)
        throw redirect({ to: "/dashboard" });
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
          col aic jcc gap-y-4 mya mx-4
          before:(
            content-[''] fixed -z-1 inset-0 size-full bg-[linear-gradient(to_right,var(--shaded)_1px,_transparent_1px),linear-gradient(to_bottom,var(--shaded)_1px,_transparent_1px)] bg-size-[20px_30px] mask-[radial-gradient(ellipse_70%_60%_at_50%_100%,_#000_60%,_transparent_100%)]
          )
      "
    >
      <nav>
        <ul class="ui-card flex aic gap-x-2 p-2 rounded-lg shadow-[#0000001a_0px_1px_3px_0px,#0000000f_0px_1px_2px_0px] max-[500px]:text-sm *:flex-1">
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

      <div class="max-w-md w-full">
        <Outlet />
      </div>
    </main>
  );
}
