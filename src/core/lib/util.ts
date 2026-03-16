import { type AuthError, getErrorMessage } from "~/auth/lib/client";
import type { useRouter } from "@tanstack/solid-router";

type AuthFnResolvedError = { error: AuthError };

/** Used to prevent considering returned auth fn promise as not rejected if it resolves to an API error */
export const useAuthFnPromise = <T>(fnPromise: Promise<T>) =>
  // oxlint-disable-next-line typescript/no-misused-promises
  new Promise<T>((res, rej) =>
    fnPromise
      .then((resolved: T) => {
        if (resolved) {
          const error = (resolved as T & AuthFnResolvedError).error;
          if (error) rej({ ...error, message: getErrorMessage(error) });
          res(resolved as T);
        }
      })
      .catch(rej),
  );

/** Used to invalidate router when toast is shown */
export const refreshAfterToast = (
  router: ReturnType<typeof useRouter>,
  message: string,
) => {
  queueMicrotask(() => {
    router.invalidate();
  });

  return message;
};

export const useToastErrorMsg = (
  error: Error | { message: string },
  defaultMsg: string,
) => {
  console.error(error);
  return error instanceof Error ? defaultMsg : error?.message || defaultMsg;
};
