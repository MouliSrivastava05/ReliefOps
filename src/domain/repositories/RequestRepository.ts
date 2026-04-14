import { RequestModel } from "../models/RequestModel";
import type { IRequestRepository } from "./interfaces/IRequestRepository";

export class RequestRepository implements IRequestRepository {
  async findById(id: string): Promise<unknown | null> {
    return RequestModel.findById(id).lean().exec();
  }

  async findAll(): Promise<any[]> {
    return RequestModel.find().lean().exec();
  }

  async findQueuedOrdered(): Promise<any[]> {
    return RequestModel.find({ status: "QUEUED" }).sort({ priority: -1 }).lean().exec();
  }
}
