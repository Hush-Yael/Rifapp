import { createFileRoute } from "@tanstack/solid-router";
import Sign from "~/auth/components/sign-[in-up]";

export const Route = createFileRoute("/(auth)/_redir-to-dashboard/signup")({
  component: () => <Sign type="signup" />,
  head: () => ({
    meta: [{ title: `Crear cuenta | ${import.meta.env.VITE_APP_NAME}` }],
  }),
});
