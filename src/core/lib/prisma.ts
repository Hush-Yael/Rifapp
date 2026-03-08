import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "~/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const prisma = globalThis.__prisma || new PrismaClient({ adapter });

declare global {
  var __prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
