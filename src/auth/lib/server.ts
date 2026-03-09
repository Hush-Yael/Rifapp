import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/core/lib/prisma";
import { username, admin, organization } from "better-auth/plugins";
import { maxPass, minPass } from "./constants";
import { testUtils } from "better-auth/plugins";
import { sendEmail } from "~/core/lib/mails";

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  baseURL: "http://localhost:3000/",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: minPass,
    maxPasswordLength: maxPass,
    resetPasswordTokenExpiresIn: 60 * 60 * 24,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Restablecer contraseña",
        text: `Haz click en este enlace para restablecer tu contraseña: ${url}. Este enlace es válido por 24 horas`,
      });
    },
  },
  experimental: { joins: true },
  plugins: [username(), admin(), organization(), testUtils()],
});

export default auth;
