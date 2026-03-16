import { createSignal } from "solid-js";
import authClient from "../lib/client";
import toast from "~/core/components/widgets/toast";
import { useAppForm } from "~/shared/hooks/forms";
import { emailValidator } from "../lib/validators";
import { useAuthFnPromise } from "~/core/lib/util";

export default function ForgotPassword() {
  const [sendCountdown, setSendCountdown] = createSignal(0);
  let countdownInterval: NodeJS.Timeout;

  const form = useAppForm(() => ({
    defaultValues: {
      email: "admin@rifapp.com",
    },
    onSubmit: async ({ value: data }) => {
      clearInterval(countdownInterval);

      toast.promise(
        useAuthFnPromise(
          authClient.requestPasswordReset({ email: data.email }),
        ),
        {
          onLoading: "Enviando correo de recuperación...",
          onSuccess: () => {
            setSendCountdown(30);

            countdownInterval = setInterval(() => {
              setSendCountdown((prevCount) => {
                const newCount = prevCount - 1;
                if (newCount <= 0) clearInterval(countdownInterval);

                return newCount;
              });
            }, 1000);

            return "Correo de recuperación enviado";
          },
          onError: "Error al enviar el correo de recuperación",
        },
      );
    },
  }));

  const isSubmitted = form.useStore((state) => state.isSubmitted);

  return (
    <div class="ui-card py-4 px-6">
      <div class="rounded-full bg-muted text-muted-text size-12 p-2 mxa mb-3">
        <svg
          stroke-width="2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M15 21H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h10c.265 0 .518.052.75.145"></path>
          <path d="M11 16a1 1 0 1 0 2 0 1 1 0 0 0-2 0M8 11V7a4 4 0 1 1 8 0v4M19 22v.01M19 19a2.003 2.003 0 0 0 .914-3.782 1.98 1.98 0 0 0-2.414.483"></path>
        </svg>
      </div>

      <hgroup class="col gap-y-3 tac">
        <h1 class="text-xl font-bold ">¿Olvidaste tu contraseña?</h1>
        <p class="text-(muted-text balance sm)">
          Ingresa el correo de tu cuenta y se le enviará un enlace para
          restablecer tu contraseña
        </p>
      </hgroup>

      <form.AppForm>
        <form.FormComponent class="col gap-y-4 mt-10" method="post">
          <form.AppField
            name="email"
            validators={{
              onChange: emailValidator,
            }}
          >
            {(f) => (
              <f.TextField
                label="Correo"
                labelClass="sr-only"
                type="email"
                required
                class="col gap-y-1"
                inputClass="ui-input/on-card"
              />
            )}
          </form.AppField>

          <form.SubmitButton
            disabled={sendCountdown() > 0}
            class="ui-btn ui-btn/primary w-full p-1.5"
          >
            <span>
              {isSubmitted() ? "Volver a enviar" : "Enviar"}
              {sendCountdown() > 0 && (
                <span class="ml-1 tracking-wider tabular-nums">
                  ({sendCountdown()})
                </span>
              )}
            </span>
          </form.SubmitButton>
        </form.FormComponent>
      </form.AppForm>
    </div>
  );
}
