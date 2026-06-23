import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const code = credentials.code as string | undefined;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        if (!user.isActive) {
          throw new Error("AccountBlocked");
        }

        // Если у пользователя включена 2FA, проверяем код
        if (user.isTwoFactorEnabled) {
          if (!code) {
            throw new Error("TwoFactorRequired");
          }

          // Проверка TOTP кода
          const speakeasy = await import("speakeasy");
          const isValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret!,
            encoding: "base32",
            token: code,
            window: 1,
          });

          if (!isValid) {
            // Также проверяем по резервным кодам (TwoFactorToken)
            const storedToken = await db.twoFactorToken.findFirst({
              where: {
                email: user.email,
                token: code,
                expires: { gt: new Date() },
              },
            });

            if (!storedToken) {
              return null;
            }

            await db.twoFactorToken.delete({
              where: { id: storedToken.id },
            });
          }
        }

        if (!user.emailVerified) {
          throw new Error("EmailNotVerified");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          isTwoFactorEnabled: user.isTwoFactorEnabled,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isTwoFactorEnabled = (user as any).isTwoFactorEnabled;
      }

      // Обновляем данные из БД при каждом запросе
      if (trigger === "update" && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            isTwoFactorEnabled: true,
            isActive: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.isTwoFactorEnabled = dbUser.isTwoFactorEnabled;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      return session;
    },
  },
});