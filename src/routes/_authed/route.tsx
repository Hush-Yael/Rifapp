import { createFileRoute, redirect } from "@tanstack/solid-router";
import getSession from "~/auth/hooks/getSession";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (!session)
      throw redirect({
        to: "/login",
        // preserve protected route url for redirect when logging in
        search: { redirect: location.href },
      });

    // Pass session to child routes
    return session;
  },
});
