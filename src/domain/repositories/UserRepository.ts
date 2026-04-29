import { UserModel } from "../models/UserModel";
import type { IUserRepository, UserRecord } from "./interfaces/IUserRepository";

function toRecord(doc: unknown): UserRecord | null {
  if (!doc || typeof doc !== "object") return null;
  const d = doc as Record<string, unknown>;
  const id = d._id as { toString(): string } | undefined;
  if (!id) return null;
  return {
    _id: id,
    email: String(d.email),
    role: String(d.role),
    passwordHash: String(d.passwordHash),
    name: d.name ? String(d.name) : "",
  };
}

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<UserRecord | null> {
    const doc = await UserModel.findById(id).lean().exec();
    return toRecord(doc);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() })
      .lean()
      .exec();
    return toRecord(doc);
  }
}
