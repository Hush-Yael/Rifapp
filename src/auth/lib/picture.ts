import { createServerFn } from "@tanstack/solid-start";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { ensureDir } from "../../core/lib/util";
import auth from "./server";
import { getRequestHeaders } from "@tanstack/solid-start/server";

const assetsDir = "public";

export const updateProfilePictureFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      previousImageURL: z.string().nullish(),
      previousThumbnailURL: z.string().nullish(),
      arrayBuffer: z.instanceof(ArrayBuffer),
    }),
  )
  .handler(async ({ data }) => {
    const dir = path.join(assetsDir, "uploads", "pictures");
    await ensureDir(dir);

    const { arrayBuffer, previousImageURL, previousThumbnailURL } = data;

    const rmMainPromise = previousImageURL
      ? fs.rm(assetsDir + previousImageURL, {
          force: import.meta.env.PROD,
        })
      : undefined;

    const rmThumbPromise = previousThumbnailURL
      ? fs.rm(assetsDir + previousThumbnailURL, {
          force: import.meta.env.PROD,
        })
      : undefined;

    const fileName = `${nanoid()}.webp`;
    const filePath = path.join(dir, fileName);
    const thumbnailPath = filePath.replace(".webp", ".thumbnail.webp");

    const optimized = optimizeProfilePicture(arrayBuffer);
    const thumbnail = generateThumbnail(arrayBuffer);

    await Promise.all([
      rmMainPromise,
      rmThumbPromise,
      optimized.toFile(filePath),
      thumbnail.toFile(thumbnailPath),
    ]);

    return [
      filePath.slice(assetsDir.length),
      thumbnailPath.slice(assetsDir.length),
    ] as const;
  });

const optimizeProfilePicture = (buffer: ArrayBuffer) =>
  sharp(buffer)
    .resize({
      width: 800,
      height: 800,
      fit: "cover",
      withoutEnlargement: true,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .webp({ nearLossless: true, quality: 50 });

const generateThumbnail = (buffer: ArrayBuffer) =>
  sharp(buffer)
    .resize({
      width: 200,
      height: 200,
      fit: "cover",
    })
    .webp({ quality: 50 });

export const deleteProfilePictureFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      imageURL: z.string().nullish(),
      thumbnailURL: z.string().nullish(),
    }),
  )
  .handler(async ({ data }) => {
    const { imageURL, thumbnailURL } = data;

    await Promise.all([
      imageURL && fs.rm(assetsDir + imageURL, { force: true }),
      thumbnailURL &&
        fs.rm(assetsDir + thumbnailURL, {
          force: true,
        }),
      auth.api.updateUser({
        headers: getRequestHeaders(),
        body: { image: null, thumbnail: null },
      }),
    ]);
  });
