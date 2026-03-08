import { z } from "zod";

export const CustomZodErrorMessages = {
  invalidValue: (_: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx) => {
    return {
      message: !ctx.data ? "Este campo es requerido" : "El valor no es válido",
    };
  },

  requiredValue: "Este campo es requerido",

  minLength: (amount: number) => `Se requieren al menos ${amount} caracteres`,

  maxLength: (amount: number) => `Se acepta un máximo de ${amount} caracteres`,

  minValue: (amount: number) => `El valor debe ser mayor o igual a ${amount}`,

  maxValue: (amount: number) => `El valor debe ser menor o igual a ${amount}`,
};
