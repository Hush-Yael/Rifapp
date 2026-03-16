import { useFormContext } from "~/shared/hooks/forms";
import type { JSX, ParentProps } from "solid-js";
import { useHydrated } from "@tanstack/solid-router";

interface ResetBtnProps<T extends Record<string, never>>
  extends ParentProps, JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  resetData?: T;
}

export default function ResetBtn<T extends Record<string, never>>(
  props: ResetBtnProps<T>,
) {
  const isHydrated = useHydrated();
  const Form = useFormContext();

  return (
    <Form.Subscribe
      selector={(state) => ({
        isPristine: state.isPristine,
        isSubmitting: state.isSubmitting,
      })}
    >
      {(state) => (
        <button
          {...props}
          disabled={
            props.disabled ||
            !isHydrated() ||
            state().isPristine ||
            state().isSubmitting
          }
          type="reset"
          onClick={(e) => {
            Form.reset(props.resetData);
            // @ts-expect-error: onClick works as expected
            props.onClick?.(e);
          }}
        >
          {props.children}
        </button>
      )}
    </Form.Subscribe>
  );
}
