import { FileField } from "@kobalte/core/file-field";
import { Dialog } from "@kobalte/core/dialog";
import { createSignal, Show, type Accessor, type Setter } from "solid-js";
import Icons from "~/core/components/icons";
import { withForm } from "~/shared/hooks/forms";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_PROFILE_IMG_SIZE,
} from "~/auth/lib/constants";
import Modal from "~/shared/components/widgets/modal";
import type { UserData, UserImageURL } from ".";
import { useRouter } from "@tanstack/solid-router";
import { useServerFn } from "@tanstack/solid-start";
import { profilePictureValidator } from "~/auth/lib/validators";
import { deleteProfilePictureFn } from "~/auth/lib/picture";
import toast from "~/core/components/widgets/toast";
import { refreshAfterToast, useToastErrorMsg } from "~/core/lib/util";

const PictureField = withForm({
  defaultValues: undefined as unknown as ReturnType<UserData>,
  props: undefined as unknown as {
    user: UserData;
    setImgSrc: Setter<UserImageURL>;
    imgSrc: Accessor<UserImageURL>;
  },
  render: ({ form: Form, user, imgSrc, setImgSrc }) => {
    const [profilePictureRef, setProfilePictureRef] =
      createSignal<HTMLImageElement>();

    const validator = profilePictureValidator
      .refine(
        (file) => {
          return file instanceof File
            ? profilePictureRef()!.naturalHeight >= 300
            : true;
        },
        {
          message: "La imagen debe tener una altura mínima de 300px",
        },
      )
      .refine(
        (file) =>
          file instanceof File
            ? profilePictureRef()!.naturalWidth >= 300
            : true,
        {
          message: "La imagen debe tener un ancho mínimo de 300px",
        },
      );

    return (
      <Form.AppField
        name="image"
        validators={{
          onChange: validator,
        }}
      >
        {(f) => (
          <FileField
            class="group min-[500px]:(flex aic jb gap-x-4)"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            maxFiles={1}
            maxFileSize={MAX_PROFILE_IMG_SIZE}
            // oxlint-disable-next-line typescript/no-misused-promises
            onFileChange={async ({ acceptedFiles }) => {
              const [img] = acceptedFiles;
              const newSrc = URL.createObjectURL(img);
              setImgSrc(newSrc);

              // could happen that user has no profile picture, so svg is shown instead of refed img, so we need to create it to check its dimensions
              const imgElement =
                profilePictureRef() ||
                Object.assign(new Image(), { src: newSrc });

              // wait for the image to load to be able to check its natural dimensions in the validator
              await new Promise((r) =>
                imgElement.addEventListener("load", r, {
                  once: true,
                }),
              );

              f().handleChange(img);
            }}
            validationState={
              f().state.meta.errors.length > 0 ? "invalid" : "valid"
            }
          >
            <FileField.HiddenInput tabIndex={-1} />

            <FileField.Label class="min-w-150px max-[500px]:sr-only">
              Foto de perfil
            </FileField.Label>

            <div class="flex aic gap-x-4 flex-1 min-[500px]:(justify-end max-w-350px)">
              <PicturePreview
                imgSrc={imgSrc}
                profilePictureRef={profilePictureRef}
                setProfilePictureRef={setProfilePictureRef}
              />

              <div class="col gap-y-3">
                <div class="flex aic gap-x-2 text-sm">
                  <FileField.Trigger class="ui-btn ui-btn/card p-0.5 px-3">
                    <Icons.upload class="size-3.25" />
                    Subir
                  </FileField.Trigger>

                  <DeletePictureBtn user={user} setImgSrc={setImgSrc} />
                </div>

                <FileField.ErrorMessage class="ui-input-error/on-card col-start-2">
                  <Form.ErrorMap />
                </FileField.ErrorMessage>

                <FileField.Description class="data-[invalid]:hidden text-(muted-text xs min-[500px]:sm)">
                  PNG, JPG o WebP. Tamaño máximo 3MB
                </FileField.Description>
              </div>
            </div>
          </FileField>
        )}
      </Form.AppField>
    );
  },
});

export default PictureField;

function DeletePictureBtn(props: {
  user: UserData;
  setImgSrc: Setter<UserImageURL>;
}) {
  const router = useRouter();
  const deleteProfilePicture = useServerFn(deleteProfilePictureFn);

  return (
    <Modal
      iconClass="p-2"
      icon={<Icons.trash />}
      trigger={
        <Dialog.Trigger
          disabled={!props.user().imageURL}
          class="ui-btn ui-btn/danger p-0.5 px-3"
        >
          <Icons.trash class="size-3.25" />
          Eliminar
        </Dialog.Trigger>
      }
      title="Eliminar foto de perfil"
      danger
      submitLabel="Eliminar"
      onConfirm={() => {
        toast.promise(
          deleteProfilePicture({
            data: {
              imageURL: props.user().imageURL,
              thumbnailURL: props.user().thumbnail,
            },
          }),
          {
            onLoading: "Eliminando foto de perfil...",
            onSuccess: () => {
              props.setImgSrc(null);
              return refreshAfterToast(router, "Foto de perfil eliminada");
            },
            onError: (error) =>
              useToastErrorMsg(error, "No se pudo eliminar la foto de perfil"),
          },
        );
      }}
    >
      ¿Realmente quieres eliminar tu foto de perfil?
    </Modal>
  );
}

function PicturePreview(props: {
  imgSrc: Accessor<UserImageURL>;
  profilePictureRef: Accessor<HTMLImageElement | undefined>;
  setProfilePictureRef: Setter<HTMLImageElement | undefined>;
}) {
  return (
    <Show
      when={props.imgSrc()}
      fallback={
        <svg
          class="size-20 size-min-20 aspect-square text-neutral-300"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="256"
            cy="256"
            r="256"
            class="text-neutral-400 light:filter-brightness-115 dark:text-neutral-600"
          ></circle>
          <path
            class="text-neutral-200 dark:text-neutral-800"
            d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"
          />
        </svg>
      }
    >
      <Dialog>
        <Dialog.Trigger
          class="ui-btn rounded-full outline-(2 offset-2 border) focus-visible:outline-accent not-focus-visible:group-data-[invalid]:outline-danger"
          aria-label="Expandir foto"
        >
          <img
            ref={props.setProfilePictureRef}
            class="size-20 size-min-20 aspect-square rounded-full object-cover"
            src={props.imgSrc()!}
            alt="Foto de perfil"
          />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay class="fixed z-10 inset-0 fc bg-#0003 dark:bg-#0008 data-[closed]:animate-[overlay-hide_250ms_ease] data-[expanded]:animate-[overlay-show_250ms_ease_forwards]" />

          <div class="fixed z-10 inset-0 fc">
            <Dialog.Content class="w-92% aspect-square size-max-600px rounded animate-[content-hide_250ms_ease-in_forwards] data-[expanded]:animate-[content-show_250ms_ease-out]">
              <img
                src={props.imgSrc()!}
                alt="Foto de perfil"
                class="size-full object-cover rounded"
              />
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog>
    </Show>
  );
}
