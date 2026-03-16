import { createFileRoute } from "@tanstack/solid-router";
import Account from "~/auth/components/account";

export const Route = createFileRoute("/_authed/account")({
  component: Account,
  head: () => ({
    meta: [{ title: `Control de cuenta | ${import.meta.env.VITE_APP_NAME}` }],
  }),
});
