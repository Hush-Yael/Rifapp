import { createFileRoute, redirect } from "@tanstack/solid-router";
import authClient from "~/auth/lib/client";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ location }) => {
    const session = await authClient.getSession();

    if (session == null || session.data?.user == null)
      throw redirect({
        to: "/login",
        // preserve protected route url for redirect when logging in
        search: { redirect: location.href },
      });

    // Pass session to child routes
    return session;
  },
});
