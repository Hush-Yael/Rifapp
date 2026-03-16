import { useFieldContext } from "~/shared/hooks/forms";

export default function ErrorMap() {
  const f = useFieldContext();
  const errors = f().state.meta.errors;

  return typeof errors[0] === "string" ? errors[0] : errors[0]!.message;
}
