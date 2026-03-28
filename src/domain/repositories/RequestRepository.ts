import { RequestModel } from "../models/RequestModel";
import type { IRequestRepository } from "./interfaces/IRequestRepository";

export class RequestRepository implements IRequestRepository {
  async findById(id: string): Promise<unknown | null> {
    return RequestModel.findById(id).lean().exec();
  }

  async findAll(): Promise<unknown[]> {
    return RequestModel.find().lean().exec();
  }
}
