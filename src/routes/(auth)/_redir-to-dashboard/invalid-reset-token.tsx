import { createFileRoute } from "@tanstack/solid-router";
import { InvalidResetToken } from "~/auth/components/invalid-reset-token";

export const Route = createFileRoute(
  "/(auth)/_redir-to-dashboard/invalid-reset-token",
)({
  component: () => <InvalidResetToken />,
});
