import { Link } from "@tanstack/solid-router";
import {
  emailValidator,
  passwordValidator,
  usernameOrEmailValidator,
  usernameValidator,
  verifyUserDataFn,
} from "~/auth/lib/validators";
import { useAppForm } from "~/shared/hooks/forms";
import toast from "~/core/components/widgets/toast";
import authClient, { getErrorMessage } from "~/auth/lib/client";
import { useServerFn } from "@tanstack/solid-start";
import type { AsyncSubmitValidationResult } from "~/shared/types/forms";
import { useNavigate } from "@tanstack/solid-router";
import { Route as LoginRoute } from "~/routes/(auth)/_redir-to-dashboard/login";
import { Route as SignupRoute } from "~/routes/(auth)/_redir-to-dashboard/signup";

type FormValues = {
  usernameOrEmail: string;
  newUsername: string;
  password: string;
};

export default function RouteComponent(props: { type: "login" | "signup" }) {
  const isLogin = props.type === "login";
  const checkUserFn = useServerFn(verifyUserDataFn);
  const navigate = useNavigate();
  const search = (isLogin ? LoginRoute : SignupRoute).useSearch();

  const submitFn = (data: FormValues) => {
    if (isLogin) {
      const isEmail = data.usernameOrEmail.includes("@");

      if (isEmail)
        return authClient.signIn.email({
          email: data.usernameOrEmail,
          password: data.password,
        });
      else
        return authClient.signIn.username({
          username: data.usernameOrEmail,
          password: data.password,
        });
    } else
      return authClient.signUp.email({
        name: "",
        email: data.usernameOrEmail,
        username: data.newUsername,
        password: data.password,
      });
  };

  const Form = useAppForm(() => ({
    defaultValues: {
      usernameOrEmail: "",
      newUsername: "",
      password: "",
    } satisfies FormValues,

    validators: {
      onSubmitAsync: async ({
        value: data,
      }): AsyncSubmitValidationResult<FormValues> => {
        const { error, validUsernameOrMail, validNewUsername, validPass } =
          await checkUserFn({
            data: { ...data, isLogin },
          });

        if (validUsernameOrMail === false)
          return {
            fields: {
              usernameOrEmail: {
                message: error!,
              },
            },
          };

        if (validNewUsername === false)
          return {
            fields: {
              newUsername: {
                message: error!,
              },
            },
          };

        if (validPass === false)
          return {
            fields: {
              password: {
                message: error!,
              },
            },
          };
      },
    },

    onSubmit: async ({ value: data }) => {
      await new Promise((res, rej) => {
        toast.promise(
          submitFn(data).then(({ error }) => {
            if (error) throw { ...error, message: getErrorMessage(error) };
          }),
          {
            onLoading: "Subiendo datos...",
            onSuccess: () => {
              res(true);

              return (
                (isLogin ? "Se inició sesión" : "Cuenta creada") +
                " correctamente"
              );
            },
            onError: (error) => {
              rej(error);
              return error?.message || "Ocurrió un error al subir los datos";
            },
          },
        );
      });

      navigate({
        to: search().redirect || "/dashboard",
        replace: import.meta.env.PROD,
      });
    },
  }));

  return (
    <div class="bg-muted shadow-[--card-shadow] rounded-card">
      <div class="col gap-y-6 p-6 bg-card rounded-t-card">
        <hgroup class="text-center mb-4">
          <h1 class="text-2xl font-bold">
            {props.type === "login" ? "Iniciar sesión" : "Registro"}
          </h1>

          <p class="mt-2 text-(sm balance muted-text)">
            {props.type === "login"
              ? "Ingresa los datos de tu cuenta"
              : "Indica los datos para tu nueva cuenta"}
          </p>
        </hgroup>

        <Form.AppForm>
          <Form.FormComponent class="col gap-y-6" method="post">
            <Form.AppField
              name="usernameOrEmail"
              validators={{
                onChange: isLogin ? usernameOrEmailValidator : emailValidator,
              }}
            >
              {(f) => (
                <f.TextField
                  required
                  class="col gap-y-1"
                  label={isLogin ? "Correo o nombre de usuario" : "Correo"}
                  labelClass="input-label"
                  inputClass="ui-input/on-card"
                  inputProps={{ inputMode: "email" }}
                  errorClass="ui-input-error/on-card"
                />
              )}
            </Form.AppField>

            {!isLogin && (
              <Form.AppField
                name="newUsername"
                validators={{
                  onChange: usernameValidator,
                }}
              >
                {(f) => (
                  <f.TextField
                    required
                    class="col gap-y-1"
                    label="Nombre de usuario"
                    labelClass="input-label"
                    inputClass="ui-input/on-card"
                    errorClass="ui-input-error/on-card"
                  />
                )}
              </Form.AppField>
            )}

            <Form.AppField
              name="password"
              validators={{
                onChange: passwordValidator,
              }}
            >
              {(f) => (
                <f.PasswordField
                  required
                  label="Contraseña"
                  resetPasswordLink={isLogin}
                  class="group/input-root col gap-y-1"
                  inputContainerClass="ui-input/on-card flex items-center justify-between gap-2 py-1! pl-0! pr-1.5! focus-within:outline-2 [.group\/input-root[data-invalid]_&]:(border-danger shadow-none)"
                  inputClass="px-2 w-full outline-0 "
                  errorClass="ui-input-error/on-card"
                />
              )}
            </Form.AppField>

            <Form.SubmitButton class="ui-btn ui-btn/primary w-full p-1.5 mt-4">
              {props.type === "login" ? "Ingresar" : "Crear cuenta"}
            </Form.SubmitButton>
          </Form.FormComponent>
        </Form.AppForm>
      </div>

      <div class="text-center py-3">
        <span class="text-sm text-muted-text mr-2">
          ¿{props.type === "login" ? "No" : "Ya"} tienes una cuenta?
        </span>

        <Link
          to={props.type === "login" ? "/signup" : "/login"}
          class="ui-link/primary text-sm"
        >
          {props.type === "login" ? "Regístrate" : "Inicia sesión"}
        </Link>
      </div>
    </div>
  );
}
