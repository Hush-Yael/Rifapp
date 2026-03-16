import { Content, type TabsContentProps } from "@kobalte/core/tabs";
import type { JSX } from "solid-js";
import type { TabValue } from "..";

type TabProps = TabsContentProps &
  JSX.IntrinsicElements["div"] & {
    value: TabValue;
    title: string;
    subtitle: string;
  };

export default function AccountTab(props: TabProps) {
  return (
    <Content
      {...props}
      class={`col flex-1 gap-y-6 ${props.class || ""} sidebar:(max-w-900px w-full mxa)`}
      title={null}
      subtitle={null}
    >
      <hgroup class="col gap-y-1 border-b border-[--shaded] pb-2">
        <h1 class="text-xl font-bold">{props.title}</h1>
        <p class="text-muted-text max-[500px]:text-sm">{props.subtitle}</p>
      </hgroup>

      {props.children}
    </Content>
  );
}
