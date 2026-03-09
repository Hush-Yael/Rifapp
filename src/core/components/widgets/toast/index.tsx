import { type JSX } from "solid-js";
import { Switch, Match } from "solid-js/web";
import BaseToastComponent, { showToastFn, type ToastFnProps } from "./base";
import { toaster, type ToastPromiseState } from "@kobalte/core/toast";
import { FaSolidCircleCheck } from "solid-icons/fa";
import { FaSolidCircleInfo, FaSolidWarning } from "solid-icons/fa";
import { MdRoundCancel } from "solid-icons/md";

const Icons = {
  pending: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 2400 2400"
    >
      <g
        stroke-width="200"
        stroke-linecap="round"
        stroke="currentColor"
        fill="none"
      >
        <line x1="1200" y1="600" x2="1200" y2="100" />
        <line opacity="0.5" x1="1200" y1="2300" x2="1200" y2="1800" />
        <line opacity="0.917" x1="900" y1="680.4" x2="650" y2="247.4" />
        <line opacity="0.417" x1="1750" y1="2152.6" x2="1500" y2="1719.6" />
        <line opacity="0.833" x1="680.4" y1="900" x2="247.4" y2="650" />
        <line opacity="0.333" x1="2152.6" y1="1750" x2="1719.6" y2="1500" />
        <line opacity="0.75" x1="600" y1="1200" x2="100" y2="1200" />
        <line opacity="0.25" x1="2300" y1="1200" x2="1800" y2="1200" />
        <line opacity="0.667" x1="680.4" y1="1500" x2="247.4" y2="1750" />
        <line opacity="0.167" x1="2152.6" y1="650" x2="1719.6" y2="900" />
        <line opacity="0.583" x1="900" y1="1719.6" x2="650" y2="2152.6" />
        <line opacity="0.083" x1="1750" y1="247.4" x2="1500" y2="680.4" />
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          keyTimes="0;0.08333;0.16667;0.25;0.33333;0.41667;0.5;0.58333;0.66667;0.75;0.83333;0.91667"
          values="0 1199 1199;30 1199 1199;60 1199 1199;90 1199 1199;120 1199 1199;150 1199 1199;180 1199 1199;210 1199 1199;240 1199 1199;270 1199 1199;300 1199 1199;330 1199 1199"
          dur="0.83333s"
          begin="0s"
          repeatCount="indefinite"
          calcMode="discrete"
        />
      </g>
    </svg>
  ),
  success: FaSolidCircleCheck,
  error: MdRoundCancel,
  warn: FaSolidWarning,
  info: FaSolidCircleInfo,
};

function promise<T>(
  /** The promise to be handled */
  promise: Promise<T>,
  options: {
    /** What to show on loading */
    onLoading: JSX.Element;
    /** What to show on success */
    onSuccess: JSX.Element | ((data: T) => JSX.Element);
    /** What to show on error */
    onError:
      | JSX.Element
      | ((error: Error | { message: string }) => JSX.Element);
    /** Specify the duration for each state */
    durations?: Partial<Record<Exclude<ToastPromiseState, "pending">, number>>;
    /** Specify message description for each state */
    descriptions?: Record<ToastPromiseState, JSX.Element>;
  },
) {
  return toaster.promise(promise, ({ toastId, state, data, error }) => {
    return (
      <BaseToastComponent
        toastId={toastId}
        description={options?.descriptions?.[state]}
        persistent={state === "pending"}
        duration={
          state !== "pending" && options.durations
            ? options.durations[state as keyof typeof options.durations]
            : undefined
        }
        classVariant="ui-toast/promise data-[state=fulfilled]:ui-toast/success data-[state=rejected]:ui-toast/error"
        state={state}
        icon={
          <Switch>
            <Match when={state === "pending"}>
              <Icons.pending />
            </Match>
            <Match when={state === "fulfilled"}>
              <Icons.success class="ui-toast-icon" />
            </Match>
            <Match when={state === "rejected"}>
              <Icons.error class="ui-toast-icon" />
            </Match>
          </Switch>
        }
      >
        <Switch>
          <Match when={state === "pending"}>{options.onLoading}</Match>
          <Match when={state === "fulfilled"}>
            {typeof options.onSuccess === "function"
              ? options.onSuccess(data!)
              : options.onSuccess}
          </Match>
          <Match when={state === "rejected"}>
            {typeof options.onError === "function"
              ? options.onError(error)
              : options.onError}
          </Match>
        </Switch>
      </BaseToastComponent>
    );
  });
}

type ToastFn = (
  content: JSX.Element,
  props?: Omit<ToastFnProps, "classVariant" | "icon">,
) => number;

const toast: {
  success: ToastFn;
  error: ToastFn;
  info: ToastFn;
  warn: ToastFn;
  custom: ToastFn;
  promise: typeof promise;
} = {
  custom: (c, props) => showToastFn(c, props),

  success: (c, props) =>
    showToastFn(c, {
      ...props,
      icon: Icons.success,
      classVariant: "ui-toast/success",
    }),

  error: (c, props) =>
    showToastFn(c, {
      ...props,
      icon: Icons.error,
      classVariant: "ui-toast/error",
    }),

  info: (c, props) =>
    showToastFn(c, {
      ...props,
      icon: Icons.info,
      classVariant: "ui-toast/info",
    }),

  warn: (c, props) =>
    showToastFn(c, {
      ...props,
      icon: Icons.warn,
      classVariant: "ui-toast/warning",
    }),

  promise,
};

export default toast;
