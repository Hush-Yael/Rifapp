import { z } from "zod";
import { CustomZodErrorMessages } from "~/shared/lib/validation";
import { maxPass, minPass } from "~/auth/lib/constants";
import { createServerFn } from "@tanstack/solid-start";
import auth from "~/auth/lib/server";
import { getRequest } from "@tanstack/solid-start/server";
import { getUserByEmail, getUserByUsername } from "./queries";

export const usernameValidator = z
  .string({ errorMap: CustomZodErrorMessages.invalidValue })
  .trim()
  .min(3, CustomZodErrorMessages.minLength(3))
  .max(255, CustomZodErrorMessages.maxLength(255))
  .regex(/^[a-zA-Z0-9_.]+$/, "Solo se aceptan letras, números, _ y .");

export const emailValidator = z
  .string({ errorMap: CustomZodErrorMessages.invalidValue })
  .trim()
  .nonempty({ message: CustomZodErrorMessages.requiredValue })
  .email("El correo no es válido");

export const usernameOrEmailValidator = z
  .string({ errorMap: CustomZodErrorMessages.invalidValue })
  .superRefine((val, ctx) => {
    const result = (
      val.includes("@") ? emailValidator : usernameValidator
    ).safeParse(val);

    if (result.error?.issues) ctx.addIssue(result.error.issues[0]);
  });

export const passwordValidator = z
  .string({ errorMap: CustomZodErrorMessages.invalidValue })
  .trim()
  .nonempty({ message: CustomZodErrorMessages.requiredValue })
  .min(minPass, CustomZodErrorMessages.minLength(minPass))
  .max(maxPass, CustomZodErrorMessages.maxLength(maxPass));

export const nameValidator = z
  .string({ errorMap: CustomZodErrorMessages.invalidValue })
  .trim()
  .nonempty({ message: CustomZodErrorMessages.requiredValue })
  .min(2, CustomZodErrorMessages.minLength(2))
  .max(100, CustomZodErrorMessages.maxLength(100))
  .regex(/^[a-zA-Z\u00C0-\u017F\s]+$/, "Solo se aceptan letras y espacios");

/**
 * Verifies user data: if is signup checks if email is not taken, else if is login checks if credentials are correct
 * @returns user data if login and got no errors, error if any, and 'validUsernameOrMail' and 'validPass' variables to determine which fields are valid or not
 **/
export const verifyUserDataFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { usernameOrEmail: string; password: string; isLogin: boolean }) =>
      data,
  )
  .handler(async ({ data }) => {
    const { usernameOrEmail, password, isLogin } = data;

    try {
      let error: string | null = null,
        validUsernameOrMail: boolean | null = null,
        validPass: boolean | null = null;

      const isEmail = usernameOrEmail.includes("@");

      if (isLogin) {
        const existingUser = await (!isLogin || isEmail
          ? getUserByEmail(usernameOrEmail!)
          : getUserByUsername(usernameOrEmail!));

        // Case: non-existent user
        if (!existingUser) {
          error = `${isEmail ? "El correo" : "El nombre de usuario"} no está registrado`;
          validUsernameOrMail = false;
        }
        // Case: existing user, verify password
        else {
          const headers = getRequest().headers;

          try {
            await auth.api.verifyPassword({
              body: {
                password,
              },
              headers,
            });

            validUsernameOrMail = true;
            validPass = true;
          } catch (e: any) {
            if (e?.statusCode === 400) {
              error = "La contraseña no es correcta";
              validUsernameOrMail = true;
              validPass = false;
            } else throw e;
          }
        }
      } else {
        // Case: Signup with existing user
        if (await getUserByEmail(usernameOrEmail!)) {
          error = "El correo ya está registrado";
          validUsernameOrMail = false;
        }

        // Valid: Signup with valid user (non-existent)
        else validUsernameOrMail = true;
      }

      return {
        error,
        validUsernameOrMail,
        validPass,
      };
    } catch (error) {
      console.error("Error en verifyUserData:", error);

      return {
        data: null,
        error: "Error al verificar los datos del usuario",
        validUsernameOrMail: null,
        validPass: null,
      };
    }
  });
