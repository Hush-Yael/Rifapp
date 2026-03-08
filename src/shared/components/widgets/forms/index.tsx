import type { JSX } from "solid-js";
import { useFormContext } from "~/shared/hooks/forms";

export default function Form(
  props: Omit<JSX.IntrinsicElements["form"], "onSubmit">,
) {
  const formApi = useFormContext();

  return (
    <form
      {...props}
      noValidate={import.meta.env.DEV}
      onSubmit={(e) => {
        e.preventDefault();
        formApi.handleSubmit();
      }}
    >
      {props.children}
    </form>
  );
}
