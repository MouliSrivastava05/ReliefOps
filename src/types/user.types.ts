export type UserRole = "citizen" | "volunteer" | "admin";

export type UserDTO = {
  id: string;
  email: string;
  role: UserRole;
};
