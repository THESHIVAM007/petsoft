import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          console.log("User not found");
          return null;
        }
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );
        if (!passwordMatch) {
          console.log("Password does not match");
          return null;
        }
        return user;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      //   runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user?.email);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }
      if (isLoggedIn && isTryingToAccessApp) {
        return true;
      }
      if (isLoggedIn && !isTryingToAccessApp) {
        return Response.redirect(
          new URL("/app/dashboard", request.nextUrl).toString()
        );
      }
      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
