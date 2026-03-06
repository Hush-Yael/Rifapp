import { Toast as T, type ToastRootProps } from "@kobalte/core/toast";
import { Show, type JSX } from "solid-js";
import { IoCloseSharp as X } from "solid-icons/io";
import { toaster } from "@kobalte/core/toast";
import type { IconTypes } from "solid-icons";

export type ToastProps = Omit<ToastRootProps, "id" | "translations"> & {
  class?: string;
  classVariant?: string;
  icon?: JSX.Element | IconTypes;
  description?: JSX.Element;
  state?: "pending" | "fulfilled" | "rejected";
  children: JSX.Element;
};

const BaseToastComponent = (props: ToastProps) => (
  <T
    {...props}
    data-state={props.state}
    translations={{ close: "Cerrar" }}
    class={`ui-toast ${props.classVariant || ""} ${props.class || ""}`}
    classVariant={null}
    description={null}
    icon={null}
    state={null}
  >
    <Show when={!props.persistent}>
      <T.ProgressTrack class="ui-toast-progress-track">
        <T.ProgressFill class="ui-toast-progress-fill" />
      </T.ProgressTrack>
    </Show>

    <div class="ui-toast-content">
      {props.icon &&
        (props.icon as (p: any) => JSX.Element)({
          class: "ui-toast-icon",
        })}

      <div class="col jcc gap-1 flex-1">
        <T.Title class="font-600">{props.children}</T.Title>

        {props.description && (
          <T.Description class="ui-toast-description">
            {props.description}
          </T.Description>
        )}
      </div>

      <T.CloseButton class="ui-toast-close-btn">
        <X class="size-5" />
      </T.CloseButton>
    </div>
  </T>
);

export default BaseToastComponent;

export type ToastFnProps = Omit<ToastProps, "toastId" | "children">;

export const showToastFn = (children: JSX.Element, props?: ToastFnProps) =>
  toaster.show((cProps) => (
    <BaseToastComponent
      {...props}
      toastId={cProps.toastId}
      class={props?.class}
      icon={props?.icon}
    >
      {children}
    </BaseToastComponent>
  ));
