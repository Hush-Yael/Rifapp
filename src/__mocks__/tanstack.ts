import { vi } from "vitest";
import type { createServerFn } from "@tanstack/solid-start";

type CreateServerFn = typeof createServerFn<"GET">;
type ServerFnBuilder = ReturnType<CreateServerFn>;

export default function mockTanstack() {
  const mockRouter = vi.hoisted(() => {
    return {
      redirect: vi.fn(),
    };
  });

  const mockServerFunctionBuilder: ServerFnBuilder = vi.hoisted(() => {
    return {
      middleware: vi.fn(() => mockServerFunctionBuilder),
      inputValidator: vi.fn(() => mockServerFunctionBuilder),
      handler: vi.fn((func) => func),
    } as unknown as ServerFnBuilder;
  });

  const mockCreateServerFn: CreateServerFn = vi.hoisted(() => {
    return vi.fn(() => mockServerFunctionBuilder);
  });

  vi.mock("@tanstack/solid-start", async () => {
    return {
      createServerFn: mockCreateServerFn,
    };
  });

  vi.mock("@tanstack/solid-router", async () => {
    return {
      redirect: mockRouter.redirect,
    };
  });
}
