import type { DefaultSession, DefaultUser } from "next-auth";

export type UserRole =
  | "citizen"
  | "volunteer"
  | "admin"
  | "shelter_manager";

export type UserDTO = {
  id: string;
  email: string;
  role: UserRole;
  status: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      status: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: string;
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    email?: string;
    status?: string;
  }
}
