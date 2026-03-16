import {
  Dialog as DL,
  type DialogRootProps,
  Trigger,
} from "@kobalte/core/dialog";
import type { IconTypes } from "solid-icons";
import { type JSX, type Setter } from "solid-js";

type BaseModalProps = DialogRootProps & {
  class?: string;
  overlayClass?: string;
  descClass?: string;
  title: JSX.Element;
  children: JSX.Element;
  icon?: IconTypes | JSX.Element;
  iconClass?: string;
  onCancel?: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  danger?: boolean;
};

type ControlledModalProps = BaseModalProps & {
  open: boolean;
  setOpen?: Setter<boolean>;
};

type UncontrolledModalProps = BaseModalProps & {
  trigger: JSX.Element;
};

export default function Modal(props: ControlledModalProps): JSX.Element;
export default function Modal(props: UncontrolledModalProps): JSX.Element;
export default function Modal(props: BaseModalProps): JSX.Element {
  return (
    <DL
      {...props}
      onOpenChange={
        (props as ControlledModalProps).setOpen || props.onOpenChange
      }
    >
      {(props as UncontrolledModalProps).trigger}
      <DL.Portal>
        <DL.Overlay
          class={`fixed z-10 inset-0 fc bg-#0003 dark:bg-#0008 data-[closed]:animate-[overlay-hide_250ms_ease] data-[expanded]:animate-[overlay-show_250ms_ease_forwards] ${props.overlayClass}`}
        >
          <DL.Content
            class={
              "col gap-y-3 py-4 *:px-5 rounded-lg bg-popover animate-[content-hide_250ms_ease-in_forwards] data-[expanded]:animate-[content-show_250ms_ease-out] max-[500px]:(w-full max-w-95%) min-[500px]:w-450px " +
              (props.class || "")
            }
          >
            <DL.Title
              class="border-b border-border pb-3 font-700"
              classList={{ "flex aic jb gap-x-3": props.icon !== undefined }}
            >
              <span>{props.title}</span>

              {props.icon && (
                <span
                  class="fc rounded-full"
                  classList={{
                    [props.iconClass!]: props.iconClass !== undefined,
                    "bg-danger/20 text-danger dark:text-danger-display":
                      props.danger,
                  }}
                >
                  {props.icon as JSX.Element}
                </span>
              )}
            </DL.Title>

            <DL.Description class={`col ${props.descClass}`}>
              {props.children}
            </DL.Description>

            <div role="group" class="flex justify-end gap-x-2 mt-3">
              <DL.CloseButton
                class="ui-btn ui-btn/muted p-0.5 px-3"
                onClick={props.onCancel}
              >
                {props.cancelLabel || "Cancelar"}
              </DL.CloseButton>

              <DL.CloseButton
                class="ui-btn p-0.5 px-3"
                classList={{
                  "ui-btn/danger": props.danger,
                  "ui-btn/primary": !props.danger,
                }}
                onClick={props.onConfirm}
              >
                {props.submitLabel || "Aceptar"}
              </DL.CloseButton>
            </div>
          </DL.Content>
        </DL.Overlay>
      </DL.Portal>
    </DL>
  );
}

export const ModalTrigger = Trigger;
