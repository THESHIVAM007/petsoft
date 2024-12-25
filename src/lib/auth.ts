import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validation";
// import { TAuth } from "@/lib/validation";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        //validation
        const validatedFormDataObject = authSchema.safeParse(credentials);
        if (!validatedFormDataObject.success) {
          return null;
        }
        //extract values

        const { email, password } = validatedFormDataObject.data;

        const user = await getUserByEmail(email);
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
      if (isLoggedIn && isTryingToAccessApp && !auth?.user.hasAccess) {
        return Response.redirect(
          new URL("/payment", request.nextUrl).toString()
        );
      }
      if (isLoggedIn && isTryingToAccessApp && auth?.user.hasAccess) {
        return true;
      }

      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup"))
      ) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }
      if (isLoggedIn && !isTryingToAccessApp && !auth?.user.hasAccess) {
        if (
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")
        ) {
          return Response.redirect(
            new URL("/payment", request.nextUrl).toString()
          );
        }
        return true;
      }
      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }
      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }
      if (trigger === "update") {
        const userFromDb = await getUserByEmail(token.email);
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
