import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";

export class AuthService {
  constructor(private readonly authOptions: NextAuthOptions) {}

  async getSession(): Promise<Session | null> {
    return getServerSession(this.authOptions);
  }
}
