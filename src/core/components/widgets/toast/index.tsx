import { type JSX } from "solid-js";
import { Switch, Match } from "solid-js/web";
import BaseToastComponent, { showToastFn, type ToastFnProps } from "./base";
import { toaster, type ToastPromiseState } from "@kobalte/core/toast";
import { FaSolidCircleCheck } from "solid-icons/fa";
import { FaSolidCircleInfo, FaSolidWarning } from "solid-icons/fa";
import { MdRoundCancel } from "solid-icons/md";
import Spinner from "~/shared/components/widgets/loaders/spinner";

const Icons = {
  pending: Spinner,
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
