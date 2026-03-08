import { createFormHookContexts } from "@tanstack/solid-form";
import { createFormHook } from "@tanstack/solid-form";
import PasswordField from "~/shared/components/widgets/forms/PasswordField";
import TextField from "~/shared/components/widgets/forms/TextField";
import FormComponent from "~/shared/components/widgets/forms/index";
import SubmitButton from "~/shared/components/widgets/forms/SubmitBtn";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
  },
  formComponents: {
    FormComponent,
    SubmitButton,
  },
  fieldContext,
  formContext,
});
