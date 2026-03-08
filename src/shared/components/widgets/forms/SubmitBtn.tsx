import { useFormContext } from "~/shared/hooks/forms";
import type { JSX, ParentProps } from "solid-js";
import { useHydrated } from "@tanstack/solid-router";

interface SubmitBtnProps
  extends ParentProps, JSX.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function SubmitBtn(props: SubmitBtnProps) {
  const isHydrated = useHydrated();
  const Form = useFormContext();

  return (
    <Form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
      })}
    >
      {(state) => (
        <button
          {...props}
          disabled={
            props.disabled ||
            !isHydrated() ||
            !state().canSubmit ||
            state().isSubmitting
          }
        >
          {props.children}
        </button>
      )}
    </Form.Subscribe>
  );
}
