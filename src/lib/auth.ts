import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { UserModel } from "@/domain/models/UserModel";
import { connectMongo } from "./mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          await connectMongo();
        } catch {
          return null;
        }
        const email = String(credentials.email).toLowerCase();
        const user = await UserModel.findOne({ email }).lean().exec();
        if (!user || !("passwordHash" in user) || !user.passwordHash) {
          return null;
        }
        const ok = await bcrypt.compare(
          String(credentials.password),
          String(user.passwordHash),
        );
        if (!ok) return null;

        const status = String((user as { status?: string }).status ?? "active");
        // Block pending/rejected volunteers — they cannot sign in
        if (status === "pending" || status === "rejected") {
          return null;
        }

        const id = (user as { _id: { toString(): string } })._id.toString();
        return {
          id,
          email: String(user.email),
          role: String(user.role),
          status,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.sub = user.id;
        token.email = user.email ?? undefined;
        token.status = (user as { status?: string }).status ?? "active";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "";
        session.user.status = (token.status as string) ?? "active";
        if (token.email) {
          session.user.email = token.email as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getSessionUser(): Promise<{
  id: string;
  email: string;
  role: string;
  status: string;
} | null> {
  const session = await getServerSession(authOptions);
  const u = session?.user;
  if (!u?.id || !u.role) return null;
  return { id: u.id, email: u.email ?? "", role: u.role, status: u.status ?? "active" };
}
