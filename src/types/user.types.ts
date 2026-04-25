import type { DefaultSession } from "next-auth";

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
    user: DefaultSession["user"] & { id: string; role: string; status: string };
  }

  interface User {
    role: string;
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    email?: string;
    status?: string;
  }
}
