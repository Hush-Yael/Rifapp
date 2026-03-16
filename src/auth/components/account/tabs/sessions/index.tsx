import authClient from "~/auth/lib/client";
import AccountTab from "../tab-content";
import { ClientOnly, useRouteContext, useRouter } from "@tanstack/solid-router";
import { BiSolidDevices } from "solid-icons/bi";
import { Show } from "solid-js";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import toast from "../../../../../core/components/widgets/toast";
import {
  refreshAfterToast,
  useAuthFnPromise,
  useToastErrorMsg,
} from "~/core/lib/util";
import SessionCard from "./card";
import Modal, { ModalTrigger } from "~/shared/components/widgets/modal";
import { TbOutlineDevicesX } from "solid-icons/tb";

export const sessionsQueryKey = ["user-sessions"];

export default function SessionsTab() {
  const queryClient = useQueryClient();
  const currentSession = useRouteContext({
    from: "/_authed",
    select: (s) => s.session,
  });

  const sessions = useQuery(() => ({
    queryKey: sessionsQueryKey,
    queryFn: async () => {
      const { data } = await useAuthFnPromise(authClient.listSessions());
      return data;
    },
  }));

  const otherSessions = () => {
    const token = currentSession().token;
    return sessions.data?.filter((s) => s.token !== token);
  };

  return (
    <AccountTab
      value="sessions"
      title="Sesiones activas"
      subtitle="Administra todas las sesiones activas de tu cuenta"
    >
      <div class="space-y-6">
        {currentSession && (
          <div class="grid cols-[repeat(auto-fill,minmax(250px,1fr))]">
            <SessionCard
              queryClient={queryClient}
              session={currentSession()}
              isCurrentSession
            />
          </div>
        )}

        <div class="space-y-4">
          <div class="flex aic jb pb-2 border-b border-[--shaded]">
            <h3 class="font-500">Otras sesiones activas</h3>
            {!!otherSessions()?.length && <RevokeAllBtn />}
          </div>

          <ClientOnly fallback={<Skeleton />}>
            <Show when={!sessions.isLoading} fallback={<Skeleton />}>
              {!otherSessions()?.length ? (
                <span role="status" class="fc gap-x-2 my-8 tac text-muted-text">
                  <span class="fc rounded-full size-8 aspect-square p-1.5 bg-[--shaded]">
                    <BiSolidDevices class="size-full" />
                  </span>
                  <span class="h-4 w-[1px] bg-[--shaded-2]"></span>
                  No hay sesiones para mostrar
                </span>
              ) : (
                <div class="grid cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
                  {otherSessions()!.map((session) => (
                    <SessionCard queryClient={queryClient} session={session} />
                  ))}
                </div>
              )}
            </Show>
          </ClientOnly>
        </div>
      </div>
    </AccountTab>
  );
}

function RevokeAllBtn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  function revokeOtherSessions() {
    toast.promise(useAuthFnPromise(authClient.revokeOtherSessions(undefined)), {
      onLoading: "Revocando las otras sesiones...",
      onError: (error) =>
        useToastErrorMsg(error, "Error al revocar las otras sesiones"),
      onSuccess: () => {
        queryClient.setQueryData(sessionsQueryKey, []);
        return refreshAfterToast(router, "Otras sesiones revocadas");
      },
    });
  }

  return (
    <Modal
      trigger={
        <ModalTrigger class="ui-btn ui-btn/danger text-sm p-1 px-2">
          Revocar todas
        </ModalTrigger>
      }
      danger
      iconClass="p-2"
      icon={<TbOutlineDevicesX class="scale-115" />}
      title="Revocar otras sesiones"
      submitLabel="Revocar"
      onConfirm={revokeOtherSessions}
    >
      ¿Realmente deseas revocar todas las sesiones de otros dispositivos?
    </Modal>
  );
}

function Skeleton() {
  return (
    <div
      class="grid cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3"
      role="status"
      aria-label="Cargando otras sesiones"
    >
      {Array.from({ length: 4 }, () => (
        <div class="animate-pulse ui-card h-125px" />
      ))}
    </div>
  );
}
