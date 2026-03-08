import { createAuthClient } from "better-auth/client";
import {
  usernameClient,
  adminClient,
  organizationClient,
} from "better-auth/client/plugins";

const authClient = createAuthClient({
  plugins: [usernameClient(), adminClient(), organizationClient()],
});

export default authClient;

type ErrorTypes = Partial<Record<keyof typeof authClient.$ERROR_CODES, string>>;

const errorCodes = {
  INVALID_EMAIL: "El correo no es válido",
  INVALID_PASSWORD: "La contraseña no es válida",
  INVALID_EMAIL_OR_PASSWORD: "El correo o la contraseña son inválidos",
  USER_ALREADY_EXISTS: "El usuario ya está registrado",
  USERNAME_IS_ALREADY_TAKEN: "El nombre de usuario ya está en uso",
  FAILED_TO_CREATE_USER: "Ocurrió un error al crear el usuario",
} satisfies ErrorTypes;

export type AuthError = {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
};

export const getErrorMessage = (error: AuthError) => {
  const { code, message } = error;

  if (code && code in errorCodes)
    return errorCodes[code as keyof typeof errorCodes];

  return message;
};
