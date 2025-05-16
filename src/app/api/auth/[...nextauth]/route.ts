import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { env } from "@/lib/zod";
import prisma from "@/lib/db/prisma";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Extend the Session type to include 'id' on user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {email: credentials.email}
        });

        if (!user || !user.password) {
          return null;
        }

        // Compare Password
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password 
        ) 

        if (!passwordMatch) {
          return null;
        }

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({session, token}) {
      if (token && session.user) {
        session.user.id = token.sub ?? "";
      }

      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
