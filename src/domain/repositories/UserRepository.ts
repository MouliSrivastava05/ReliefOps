import { UserModel } from "../models/UserModel";
import type { IUserRepository } from "./interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<unknown | null> {
    return UserModel.findById(id).lean().exec();
  }

  async findByEmail(email: string): Promise<unknown | null> {
    return UserModel.findOne({ email }).lean().exec();
  }
}
