import { createFileRoute } from "@tanstack/solid-router";
import ResetPassword from "~/auth/components/reset-password";

export const Route = createFileRoute(
  "/(auth)/_redir-to-dashboard/reset-password/$token",
)({
  component: ResetPassword,
});
