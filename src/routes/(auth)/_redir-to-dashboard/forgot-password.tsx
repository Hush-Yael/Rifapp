import { createFileRoute } from "@tanstack/solid-router";
import ForgotPassword from "~/auth/components/forgot-password";

export const Route = createFileRoute(
  "/(auth)/_redir-to-dashboard/forgot-password",
)({
  component: ForgotPassword,
});
