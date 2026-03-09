import { createFileRoute } from "@tanstack/solid-router";
import { InvalidResetToken } from "~/auth/components/invalid-reset-token";

export const Route = createFileRoute(
  "/(auth)/_redir-to-dashboard/expired-reset-token",
)({
  component: () => <InvalidResetToken expired />,
});
