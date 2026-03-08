import { beforeAll, vi } from "vitest";
import mockTanstack from "~/__mocks__/tanstack";
import auth from "~/auth/lib/server";
import type { TestHelpers } from "better-auth/plugins";

export let authTest: TestHelpers;

export default function () {
  beforeAll(async () => {
    const ctx = await auth.$context;
    authTest = ctx.test;
  });

  // ~/core/lib/__mocks__/prisma
  vi.mock("~/core/lib/prisma");

  mockTanstack();
}
