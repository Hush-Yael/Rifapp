export default function LinearLoader(props: {
  label?: string;
  class?: string;
}) {
  return (
    <div
      role="status"
      aria-label={props.label || "Cargando..."}
      class={`
        ${props.class || ""}
        relative h-1.25 w-full overflow-hidden rounded-xs
        before:(content-[''] absolute top-0 left-0 size-full bg-muted rounded-xs)
        after:(
          content-[''] absolute top-0 left-0 size-full bg-accent rounded-xs transform translate-x-[-100%] animate-[linear-loader_1s_linear_infinite]
        )
      `}
    ></div>
  );
}
