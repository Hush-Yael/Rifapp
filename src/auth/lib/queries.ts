import { prisma } from "~/core/lib/prisma";

export const getUserByEmail = async (email: string) =>
  await prisma.user.findFirst({
    where: { email: email as string },
  });

export const getUserByUsername = async (username: string) =>
  await prisma.user.findFirst({
    where: { username },
  });
