import { useRouteContext, useRouter } from "@tanstack/solid-router";
import type { UserType } from "~/generated/prisma/zod/schemas/models/User.schema";
import { useAppForm } from "~/shared/hooks/forms";

import toast from "../../../../../core/components/widgets/toast";
import { updateProfilePictureFn } from "~/auth/lib/picture";
import { useServerFn } from "@tanstack/solid-start";
import authClient from "~/auth/lib/client";
import {
  emailValidator,
  nameValidator,
  usernameValidator,
} from "~/auth/lib/validators";
import AccountTab from "../tab-content";
import {
  refreshAfterToast,
  useAuthFnPromise,
  useToastErrorMsg,
} from "~/core/lib/util";
import PictureField from "./picture-field";
import { createSignal } from "solid-js";
import { onCleanup } from "solid-js";

const getUserData = () =>
  useRouteContext({
    from: "/_authed",
    select: (s) => {
      const { email, name, image, username, thumbnail } = s.user;

      return {
        email,
        name,
        image: null as File | null | undefined,
        imageURL: image,
        thumbnail,
        username,
      } satisfies Pick<
        UserType,
        "email" | "name" | "username" | "thumbnail"
      > & {
        imageURL: UserType["image"];
        image: File | null | undefined;
      };
    },
  });

export type UserData = Awaited<ReturnType<typeof getUserData>>;
export type UserImageURL = ReturnType<
  ReturnType<typeof getUserData>
>["imageURL"];

export default function DataTab() {
  const router = useRouter();
  const updateProfilePicture = useServerFn(updateProfilePictureFn);
  const user = getUserData();

  async function handleSubmit(data: ReturnType<UserData>) {
    const { image, email, imageURL, thumbnail, ...rest } = data;
    let newImageURL = imageURL;
    let newThumbnailURL = thumbnail;

    if (image)
      [newImageURL, newThumbnailURL] = await updateProfilePicture({
        data: {
          arrayBuffer: await image.arrayBuffer(),
          previousImageURL: imageURL,
          previousThumbnailURL: thumbnail,
        },
      });

    if (email != user().email)
      await authClient.changeEmail({ newEmail: email });

    await useAuthFnPromise(
      authClient.updateUser({
        ...rest,
        image: newImageURL,
        thumbnail: newThumbnailURL,
      }),
    );
  }

  const Form = useAppForm(() => ({
    defaultValues: user(),

    onSubmit: ({ value: data }) => {
      toast.promise(handleSubmit(data), {
        onLoading: "Guardando cambios...",
        onSuccess: () => {
          queueMicrotask(() => Form.reset(data));
          return refreshAfterToast(router, "Cambios guardados");
        },
        onError: (error) =>
          useToastErrorMsg(error, "Error al guardar los cambios"),
      });
    },
  }));

  const store = Form.useStore((state) => ({
    isPristine: state.isPristine,
  }));

  const [imgSrc, setImgSrc] = createSignal(user().imageURL);

  onCleanup(() => {
    URL.revokeObjectURL(imgSrc()!);
  });

  return (
    <AccountTab
      value="data"
      title="Datos de la cuenta"
      subtitle="Maneja la información de tu cuenta y perfil público"
    >
      <Form.AppForm>
        <Form.FormComponent class="col gap-y-6 min-[500px]:(divide-y divide-[--shaded]) min-[500px]:*:not-last:pb-6">
          <PictureField
            form={Form}
            user={user}
            imgSrc={imgSrc}
            setImgSrc={setImgSrc}
          />

          <Form.AppField name="name" validators={{ onChange: nameValidator }}>
            {(f) => (
              <f.TextField
                class="col gap-y-1 min-[500px]:(grid cols-[max-content_1fr] aic jb gap-x-4)"
                inputClass="ui-input ui-input/card flex-1 min-[500px]:(max-w-350px w-full mla)"
                label="Nombre completo"
                labelClass="min-w-150px"
                errorClass="ui-input-error/on-card col-start-2 min-[500px]:(max-w-350px w-full mla)"
              />
            )}
          </Form.AppField>

          <Form.AppField name="email" validators={{ onChange: emailValidator }}>
            {(f) => (
              <f.TextField
                type="email"
                class="col gap-y-1 min-[500px]:(grid cols-[max-content_1fr] aic jb gap-x-4)"
                inputClass="ui-input ui-input/card flex-1 min-[500px]:(max-w-350px w-full mla)"
                label="Correo"
                labelClass="min-w-150px"
                errorClass="ui-input-error/on-card col-start-2 min-[500px]:(max-w-350px w-full mla)"
              />
            )}
          </Form.AppField>

          <Form.AppField
            name="username"
            validators={{ onChange: usernameValidator }}
          >
            {(f) => (
              <f.TextField
                class="col gap-y-1 min-[500px]:(grid cols-[max-content_1fr] aic jb gap-x-4)"
                inputClass="ui-input ui-input/card flex-1 min-[500px]:(max-w-350px w-full mla)"
                label="Nombre de usuario"
                labelClass="min-w-150px"
                errorClass="ui-input-error/on-card col-start-2 min-[500px]:(max-w-350px w-full mla)"
              />
            )}
          </Form.AppField>

          <div class="flex aic gap-x-2 w-full max-w-350px mla max-[500px]:mt-2 *:flex-1 text-sm">
            <Form.ResetButton
              onClick={() => setImgSrc(user().imageURL)}
              class="ui-btn ui-btn/card p-1 px-2"
            >
              Descartar cambios
            </Form.ResetButton>

            <Form.SubmitButton
              class="ui-btn ui-btn/primary p-1 px-2"
              disabled={store().isPristine}
            >
              Guardar cambios
            </Form.SubmitButton>
          </div>
        </Form.FormComponent>
      </Form.AppForm>
    </AccountTab>
  );
}
