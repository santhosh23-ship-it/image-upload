// filename: app/api/auth/[...nextauth]/authOptions.ts

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log("LOGIN TRY:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            organization: true,
          },
        });
          console.log("PASSWORD MATCH:", isValid);
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // 🔥 IMPORTANT: Return ALL required fields
        return {
          id: String(user.id),
          name: user.name ?? "",
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
          isSystemAdmin: user.isSystemAdmin,
          imageQuota: user.imageQuota ?? 5,
          organizationQuota: user.organization?.imageQuota ?? 0,
        };
      },
    }),
  ],

  callbacks: {
    // 🔐 JWT callback
    async jwt({ token, user }) {
      // On login only
      if (user) {
        token.id = user.id;
        token.name = user.name; // ✅ FIXED
        token.email = user.email;
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.isSystemAdmin = user.isSystemAdmin;
        token.imageQuota = user.imageQuota;
        token.organizationQuota = user.organizationQuota;
      }

      return token;
    },

    // 🔐 Session callback
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string; // ✅ FIXED
        session.user.email = token.email as string;
        session.user.role = token.role as
          | "PRODUCT_OWNER"
          | "ADMIN"
          | "USER";
        session.user.organizationId =
          (token.organizationId as string) ?? null;
        session.user.isSystemAdmin =
          (token.isSystemAdmin as boolean) ?? false;
        session.user.imageQuota =
          (token.imageQuota as number) ?? 5;
        session.user.organizationQuota =
          (token.organizationQuota as number) ?? 0;
      }
console.log("SESSION ROLE:", session.user.role);
      return session;
      
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
