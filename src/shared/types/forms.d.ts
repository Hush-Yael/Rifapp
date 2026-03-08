/** Used when onSubmit validation is defined on a form to determine if there are any errors on any field */
export type SubmitValidationResult<Values extends Record<string, any>> =
  | undefined
  | { fields: Partial<{ [k in keyof Values]: { message: string } }> };

/** Used when onSubmitAsync validation is defined on a form to determine if there are any errors on any field */
export type AsyncSubmitValidationResult<Values extends Record<string, any>> =
  Promise<SubmitValidationResult<Values>>;
