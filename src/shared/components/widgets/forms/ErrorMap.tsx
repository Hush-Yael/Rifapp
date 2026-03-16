import { useFieldContext } from "~/shared/hooks/forms";

export default function ErrorMap() {
  const f = useFieldContext();

  return f().state.meta.errors.map((error: { message: string } | string) => (
    <li class="list-none">
      {typeof error === "string" ? error : error.message}
    </li>
  ));
}
