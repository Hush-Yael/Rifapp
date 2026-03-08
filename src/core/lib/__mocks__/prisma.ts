import { PrismaClient } from "~/generated/prisma/client";
import { getClient } from "@pkgverse/prismock";

const prisma = await getClient({
  prismaClient: PrismaClient,
  schemaPath: "prisma/schema.prisma",
});

export { prisma };
