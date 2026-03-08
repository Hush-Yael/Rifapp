import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/core/lib/prisma";
import { username, admin, organization } from "better-auth/plugins";
import { maxPass, minPass } from "./constants";
import { testUtils } from "better-auth/plugins";

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  baseURL: "http://localhost:3000/",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: minPass,
    maxPasswordLength: maxPass,
  },
  experimental: { joins: true },
  plugins: [username(), admin(), organization(), testUtils()],
});

export default auth;
