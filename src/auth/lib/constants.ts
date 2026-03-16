export const minPass = import.meta.env.DEV ? 3 : 8;
export const maxPass = 128;

export const MAX_PROFILE_IMG_SIZE = 3 * 1024 * 1024; // 3MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
