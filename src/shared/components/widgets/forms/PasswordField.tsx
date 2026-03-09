import { useFieldContext } from "~/shared/hooks/forms";
import { createSignal, type JSX, type ParentProps } from "solid-js";
import {
  TextField as Field,
  type TextFieldRootProps,
  type TextFieldInputProps,
} from "@kobalte/core/text-field";
import {
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
} from "./TextField";
import { Link } from "@tanstack/solid-router";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "solid-icons/ai";

interface PasswordFieldProps extends ParentProps {
  id?: string;
  required?: boolean;
  class?: string;
  labelClass?: string;
  inputClass?: string;
  inputContainerClass?: string;
  errorClass?: string;
  label: JSX.Element;
  resetPasswordLink?: boolean;
  rootProps?: Omit<TextFieldRootProps, "validationState" | "id" | "required">;
  labelProps?: Omit<
    JSX.IntrinsicElements["label"],
    "class" | "children" | "for"
  >;
  inputProps?: TextFieldInputProps &
    Omit<
      JSX.IntrinsicElements["input"],
      "class" | "type" | "value" | "onChange"
    >;
  errorProps?: Omit<JSX.IntrinsicElements["div"], "children" | "class">;
  errors?: () => { message: string }[];
}

export default function PasswordField(props: PasswordFieldProps) {
  const f = useFieldContext<string>();
  const [isPassVisible, setIsPassVisible] = createSignal(false);

  return (
    <Field
      {...props.rootProps}
      class={props.class}
      id={props.id || f().name}
      validationState={f().state.meta.errors.length > 0 ? "invalid" : "valid"}
    >
      <div class="flex jb aic gap-x-4">
        <TextFieldLabel {...props.labelProps} class={props.labelClass}>
          {props.label}
        </TextFieldLabel>

        {props.resetPasswordLink && (
          <Link
            class="underline underline-offset-2 text-sm text-muted-text"
            to="/forgot-password"
          >
            Recuperar
          </Link>
        )}
      </div>

      <div
        data-invalid={f().state.meta.errors.length > 0 || null}
        class={props.inputContainerClass}
      >
        <TextFieldInput
          {...props.inputProps}
          fieldApi={f}
          class={props.inputClass}
          type={isPassVisible() ? "text" : "password"}
        />

        <button
          type="button"
          onClick={[setIsPassVisible, !isPassVisible()]}
          aria-label={isPassVisible() ? "Ocultar" : "Mostrar" + " contraseña"}
          class="ui-btn rounded p-0.5 pover:bg-[--shaded] transform-scale-120"
        >
          {isPassVisible() ? (
            <AiTwotoneEyeInvisible class="size-4.5" />
          ) : (
            <AiTwotoneEye class="size-4.5" />
          )}
        </button>
      </div>

      <TextFieldErrorMessage
        {...props.errorProps}
        class={props.errorClass}
        fieldApi={f}
        errors={props.errors}
      />
    </Field>
  );
}
