import authClient, { getErrorMessage, type AuthError } from "../lib/client";
import toast from "~/core/components/widgets/toast";
import { useAppForm } from "~/shared/hooks/forms";
import { useNavigate, useParams } from "@tanstack/solid-router";
import { z } from "zod";
import { passwordValidator } from "../lib/validators";

export default function ResetPassword() {
  const navigate = useNavigate();
  const params = useParams({
    from: "/(auth)/_redir-to-dashboard/reset-password/$token",
  });

  const form = useAppForm(() => ({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: z
        .object({
          password: passwordValidator,
          confirmPassword: passwordValidator,
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Las contraseñas no coinciden.",
          path: ["confirmPassword"],
        }),
    },
    onSubmit: async ({ value: data }) => {
      const { token } = params();

      toast.promise(
        authClient
          .resetPassword({ newPassword: data.password, token })
          .then(({ error }) => {
            if (error) throw { ...error, message: getErrorMessage(error) };
          }),
        {
          durations: { rejected: 7000 },
          onLoading: "Restableciendo contraseña...",
          onSuccess: () => {
            queueMicrotask(() => {
              navigate({
                to: "/login",
                replace: import.meta.env.PROD,
              });
            });

            return "Contraseña restablecida";
          },
          onError: (error: Error | AuthError | { message: string }) => {
            const isTokenInvalid =
              (error as AuthError)?.code === "INVALID_TOKEN";
            const isTokenExpired =
              (error as AuthError)?.code === "TOKEN_EXPIRED";

            if (isTokenExpired || isTokenInvalid) {
              queueMicrotask(() => {
                navigate({
                  to: isTokenExpired
                    ? "/expired-reset-token"
                    : "/invalid-reset-token",
                  replace: import.meta.env.PROD,
                });
              });
              return "Token inválido";
            }

            return error?.message || "Error al restablecer la contraseña";
          },
        },
      );
    },
  }));

  return (
    <div class="ui-card py-4 px-6">
      <hgroup class="col gap-y-3 tac">
        <h1 class="text-xl font-bold">Restablecer contraseña</h1>
        <p class="text-(muted-text balance sm)">
          Indica tu nueva contraseña y confirma para restablecerla
        </p>
      </hgroup>

      <form.AppForm>
        <form.FormComponent class="col gap-y-6 mt-8" method="post">
          <form.AppField
            name="password"
            validators={{
              onChange: passwordValidator,
            }}
          >
            {(f) => (
              <f.PasswordField
                required
                label="Nueva contraseña"
                class="col gap-y-1"
                inputContainerClass="ui-input/on-card ui-password-container ui-password-container/on-card"
                inputClass="ui-input/on-password-container"
                errorClass="ui-input-error/on-card"
              />
            )}
          </form.AppField>

          <form.AppField
            name="confirmPassword"
            validators={{
              onChange: ({ value, fieldApi }) =>
                value !== fieldApi.form.getFieldValue("password") &&
                "Las contraseñas no coinciden.",
            }}
          >
            {(f) => (
              <f.PasswordField
                required
                label="Confirmar contraseña"
                class="col gap-y-1"
                inputContainerClass="ui-input/on-card ui-password-container ui-password-container/on-card"
                inputClass="ui-input/on-password-container"
                errorClass="ui-input-error/on-card"
              />
            )}
          </form.AppField>

          <form.SubmitButton class="ui-btn ui-btn/primary w-full p-1.5 mt-4">
            Restablecer
          </form.SubmitButton>
        </form.FormComponent>
      </form.AppForm>
    </div>
  );
}
