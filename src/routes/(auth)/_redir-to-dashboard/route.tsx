import { Outlet, createFileRoute, redirect } from "@tanstack/solid-router";
import authClient from "~/auth/lib/client";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

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
  return (
    <main
      class="
          flex items-center justify-center mya mx-4
          before:(
            content-[''] fixed -z-1 inset-0 size-full bg-[linear-gradient(to_right,var(--shaded)_1px,_transparent_1px),linear-gradient(to_bottom,var(--shaded)_1px,_transparent_1px)] bg-size-[20px_30px] mask-[radial-gradient(ellipse_70%_60%_at_50%_100%,_#000_60%,_transparent_100%)]
          )
      "
    >
      <div class="max-w-md w-full">
        <Outlet />
      </div>
    </main>
  );
}
