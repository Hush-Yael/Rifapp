type LogoProps = {
  class?: string;
  shapeClass?: string;
  textClass?: string;
};

export default function Logo(props: LogoProps) {
  return (
    <div class={`flex gap-2 ${props.class || ""}`}>
      <LogoShape class={props.shapeClass} />
      <img
        src="/logo/letters.svg"
        alt={import.meta.env.VITE_APP_NAME}
        class={`dark:filter-invert-90 ${props.textClass || ""}`}
      />
    </div>
  );
}

export const LogoShape = (props: { class?: string }) => (
  <img src="/logo/shape.svg" alt="Forma del logo" class={props.class} />
);
