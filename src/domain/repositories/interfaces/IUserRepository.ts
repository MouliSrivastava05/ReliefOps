export type UserRecord = {
  _id: { toString(): string };
  email: string;
  role: string;
  passwordHash: string;
  name?: string;
};

export interface IUserRepository {
  findById(id: string): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
}
