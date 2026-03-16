import { UAParser } from "ua-parser-js";
import type { Session } from "better-auth";
import { MdTwotonePhone_android } from "solid-icons/md";
import { MdTwotoneDesktop_windows } from "solid-icons/md";
import Icons from "~/core/components/icons";
import { TbOutlineBrowser } from "solid-icons/tb";
import { Match, Switch } from "solid-js";
import { useRouter } from "@tanstack/solid-router";
import type { useQueryClient } from "@tanstack/solid-query";
import { sessionsQueryKey } from ".";
import toast from "~/core/components/widgets/toast";
import {
  refreshAfterToast,
  useAuthFnPromise,
  useToastErrorMsg,
} from "~/core/lib/util";
import authClient from "~/auth/lib/client";

export default function SessionCard(props: {
  queryClient: ReturnType<typeof useQueryClient>;
  session: Session;
  isCurrentSession?: boolean;
}) {
  const router = useRouter();
  const userAgentInfo = props.session.userAgent
    ? UAParser(props.session.userAgent)
    : null;

  function revoke({
    currentTarget,
  }: Event & { currentTarget: HTMLButtonElement }) {
    currentTarget.setAttribute("disabled", "true");

    toast.promise(
      useAuthFnPromise(
        authClient
          .revokeSession({
            token: props.session.token,
          })
          .finally(() => currentTarget.removeAttribute("disabled")),
      ),
      {
        onLoading: "Cerrando sesión...",
        onError: (error) =>
          useToastErrorMsg(error, "Error al revocar la sesión"),
        onSuccess: () => {
          props.queryClient.setQueryData(sessionsQueryKey, (old) => {
            if (Array.isArray(old))
              return (old as Session[])!.filter(
                (session) => session.token !== props.session.token,
              );

            return old;
          });

          return refreshAfterToast(router, "Sesión revocada");
        },
      },
    );
  }

  return (
    <article class="ui-card p-3 px-4 max-w-400px">
      <header class="flex items-start jb">
        <h2>{getBrowserInformation(userAgentInfo)}</h2>
        {props.isCurrentSession ? (
          <span class="flex aic gap-x-2 rounded-full p-0.75 px-3 bg-accent shadow-[--filled-shadow] font-600 text-(accent-text xs)">
            Actual
          </span>
        ) : (
          <button
            aria-label="Revocar sesión"
            class="ui-btn ui-btn/danger p-1"
            onClick={revoke}
          >
            <Icons.trash class="size-3.5" />
          </button>
        )}
      </header>

      <hr class="border-border my-2" />

      <dl class="col gap-y-1">
        <div class="text-sm text-muted-text *:inline">
          <dt>Creada el:</dt> <dd>{formatDate(props.session.createdAt)}</dd>
        </div>

        <div class="text-sm text-muted-text *:inline">
          <dt>Expira el:</dt> <dd>{formatDate(props.session.expiresAt)}</dd>
        </div>
      </dl>
    </article>
  );
}

const BrowserIcon = (props: { agent?: UAParser.IResult | null }) => {
  const name = props.agent?.browser.name
    ?.toLowerCase()
    .match(/(chrome|chromium|edge|firefox|safari|opera)/i);

  if (!name) return <TbOutlineBrowser class="size-5" />;

  return <img src={`/icons/${name[0]}.svg`} class="inline size-5" />;
};

const DeviceIcon = (props: { agent?: UAParser.IResult | null }) => (
  <span class="inline-flex aic jcc rounded-full size-5 scale-90">
    {props.agent?.device.type === "mobile" ? (
      <MdTwotonePhone_android class="size-full" />
    ) : (
      <MdTwotoneDesktop_windows class="size-full" />
    )}
  </span>
);

function getBrowserInformation(agent?: UAParser.IResult | null) {
  if (!agent || (!agent.browser.name && !agent.os.name))
    return "Dispositivo desconocido";

  return (
    <Switch
      fallback={
        <div class="col">
          <span class="flex aic gap-x-2">
            <BrowserIcon agent={agent} /> {agent.browser.name}
          </span>
          <span class="flex aic gap-x-2">
            <DeviceIcon agent={agent} /> {agent.os.name}
          </span>
        </div>
      }
    >
      <Match when={!agent.browser.name}>
        <span class="flex aic gap-x-2">
          <DeviceIcon agent={agent} />
          {agent.os.name}
        </span>
      </Match>
      <Match when={!agent.os.name}>
        <span class="flex aic gap-x-2">
          <BrowserIcon agent={agent} />
          {agent.browser.name}
        </span>
      </Match>
    </Switch>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
