import { createFileRoute } from "@tanstack/solid-router";
import Sign from "~/auth/components/sign-[in-up]";

export const Route = createFileRoute("/(auth)/_redir-to-dashboard/login")({
  component: () => <Sign type="login" />,
  head: () => ({
    meta: [{ title: `Iniciar sesión | ${import.meta.env.VITE_APP_NAME}` }],
  }),
});
