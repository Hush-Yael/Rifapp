import { type AuthError, getErrorMessage } from "~/auth/lib/client";

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
