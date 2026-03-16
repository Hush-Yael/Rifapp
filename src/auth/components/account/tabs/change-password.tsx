import { passwordValidator } from "~/auth/lib/validators";
import { useAppForm } from "~/shared/hooks/forms";
import { Checkbox } from "@kobalte/core/checkbox";
import toast from "../../../../core/components/widgets/toast";
import authClient from "~/auth/lib/client";
import AccountTab from "./tab-content";
import { RiSystemCheckFill } from "solid-icons/ri";
import { useAuthFnPromise } from "~/core/lib/util";

export default function ChangePasswordTab() {
  const Form = useAppForm(() => ({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      revokeOtherSessions: false,
    },
    onSubmit: ({ value: data }) => {
      toast.promise(useAuthFnPromise(authClient.changePassword(data)), {
        onLoading: "Cambiando contraseña...",
        onSuccess: () => "Contraseña cambiada",
        onError: (error) => error?.message || "Error al cambiar la contraseña",
      });
    },
  }));

  return (
    <AccountTab
      value="change-password"
      title="Cambiar contraseña"
      subtitle="Cambia la contraseña de tu cuenta"
    >
      <Form.AppForm>
        <Form.FormComponent class="col gap-y-6 min-[500px]:(divide-y divide-[--shaded]) min-[500px]:*:not-last:pb-6">
          <Form.AppField
            name="currentPassword"
            validators={{ onChange: passwordValidator }}
          >
            {(f) => (
              <f.PasswordField
                required
                label="Contraseña actual"
                labelClass="min-w-225px"
                class="col gap-y-1 min-[500px]:(grid cols-[max-content_1fr] aic jb gap-x-4)"
                inputContainerClass="ui-input ui-input/card ui-password-container ui-password-container/on-card flex-1 min-[500px]:(max-w-400px w-full mla)"
                inputClass="ui-input/on-password-container"
                errorClass="ui-input-error/on-card col-start-2 min-[500px]:(max-w-400px w-full mla)"
              />
            )}
          </Form.AppField>

          <Form.AppField
            name="newPassword"
            validators={{ onChange: passwordValidator }}
          >
            {(f) => (
              <f.PasswordField
                required
                label="Nueva contraseña"
                labelClass="min-w-225px"
                class="col gap-y-1 min-[500px]:(grid cols-[max-content_1fr] aic jb gap-x-4)"
                inputContainerClass="ui-input ui-input/card ui-password-container ui-password-container/on-card flex-1 min-[500px]:(max-w-400px w-full mla)"
                inputClass="ui-input/on-password-container"
                errorClass="ui-input-error/on-card col-start-2 min-[500px]:(max-w-400px w-full mla)"
              />
            )}
          </Form.AppField>

          <Form.AppField
            name="confirmNewPassword"
            validators={{
              onChange: ({ value, fieldApi }) => {
                const errors = fieldApi.parseValueWithSchema(passwordValidator);

                if (errors) return errors;

                return (
                  value !== fieldApi.form.getFieldValue("newPassword") &&
                  "Las contraseñas no coinciden."
                );
              },
            }}
          >
            {(f) => (
              <f.PasswordField
                required
                label="Confirmar nueva contraseña"
                labelClass="min-w-225px"
                class="col gap-y-1 min-[500px]:(grid cols-[max-content_1fr] aic jb gap-x-4)"
                inputContainerClass="ui-input ui-input/card ui-password-container ui-password-container/on-card flex-1 min-[500px]:(max-w-400px w-full mla)"
                inputClass="ui-input/on-password-container"
                errorClass="ui-input-error/on-card col-start-2 min-[500px]:(max-w-400px w-full mla)"
              />
            )}
          </Form.AppField>

          <Form.Field name="revokeOtherSessions">
            {(f) => (
              <Checkbox checked={f().state.value} onChange={f().handleChange}>
                <Checkbox.Input class="peer" />

                <Checkbox.Label class="group/label flex gap-x-2 jb select-none cursor-pointer">
                  Cerrar las sesiones en otros dispositivos
                  <Checkbox.Control
                    as="span"
                    class={`
                      ui-ripple fc size-5 mt-0.75 squircle rounded-lg outline-(2 offset-1 transparent) pointer-events-none
                      [.peer:focus-visible~.group_&]:outline-primary
                      not-[[data-checked]]:ui-input/card
                      data-[checked]:(border border-[--shaded-2] ui-primary shadow-[--filled-shadow])
                      before:(
                        -inset-2 rounded-full
                        data-[checked]:(bg-primary/20 dark:bg-primary/10)
                      )
                    `}
                  >
                    <Checkbox.Indicator
                      as={RiSystemCheckFill}
                      class="size-100%"
                    />
                  </Checkbox.Control>
                </Checkbox.Label>
              </Checkbox>
            )}
          </Form.Field>

          <Form.SubmitButton class="ui-btn ui-btn/primary w-full p-1 mt-2 mla min-[500px]:(max-w-200px)">
            Cambiar
          </Form.SubmitButton>
        </Form.FormComponent>
      </Form.AppForm>
    </AccountTab>
  );
}
