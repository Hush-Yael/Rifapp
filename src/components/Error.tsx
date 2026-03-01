import { type ErrorComponentProps } from "@tanstack/solid-router";

export default function ErrorComponent(props: ErrorComponentProps) {
  return (
    <main class="col p-6">
      <h1 class="text-(danger center 2xl) font-bold">
        Ocurrió un error inesperado
      </h1>
      <hr class="border-border my-4" />
      <pre class="size-full overflow-auto text-sm whitespace-normal indent-[-1.5em] ml-[1.5em]">
        {props.error.stack}
      </pre>
    </main>
  );
}
