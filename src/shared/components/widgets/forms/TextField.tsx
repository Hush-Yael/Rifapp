import { useFieldContext } from "~/shared/hooks/forms";
import type { JSX, ParentProps } from "solid-js";
import {
  TextField as Field,
  type TextFieldRootProps,
  type TextFieldInputProps,
} from "@kobalte/core/text-field";
import ErrorMap from "./ErrorMap";

export interface TextFieldProps extends ParentProps {
  id?: string;
  required?: boolean;
  class?: string;
  labelClass?: string;
  inputClass?: string;
  errorClass?: string;
  label: JSX.Element;
  type?: JSX.IntrinsicElements["input"]["type"];
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
  errorProps?: Omit<JSX.IntrinsicElements["ul"], "children" | "class">;
}

export default function TextField(props: TextFieldProps) {
  const f = useFieldContext<string>();

  return (
    <Field
      {...props.rootProps}
      class={props.class}
      id={props.id || f().name}
      validationState={f().state.meta.errors.length > 0 ? "invalid" : "valid"}
    >
      <TextFieldLabel {...props.labelProps} class={props.labelClass}>
        {props.label}
      </TextFieldLabel>

      <TextFieldInput
        {...props.inputProps}
        fieldApi={f}
        class={props.inputClass}
        type={props.type || "text"}
      />

      <TextFieldErrorMessage {...props.errorProps} class={props.errorClass} />
    </Field>
  );
}

type InputProps = TextFieldInputProps &
  Omit<JSX.IntrinsicElements["input"], "value" | "onChange"> & {
    fieldApi: ReturnType<typeof useFieldContext<string>>;
  };

export const TextFieldInput = (props: InputProps) => (
  <Field.Input
    {...props}
    value={props.fieldApi().state.value}
    onChange={(e: Event & { target: HTMLInputElement }) =>
      props.fieldApi().handleChange(e.target.value.trim())
    }
    fieldApi={null}
  />
);

type LabelProps = ParentProps & JSX.IntrinsicElements["label"];

export const TextFieldLabel = (props: LabelProps) => (
  <Field.Label {...props}>{props.children}</Field.Label>
);

type ErrorMessageProps = JSX.IntrinsicElements["ul"];

export const TextFieldErrorMessage = (props: ErrorMessageProps) => (
  <Field.ErrorMessage {...props} as="ul">
    <ErrorMap />
  </Field.ErrorMessage>
);
