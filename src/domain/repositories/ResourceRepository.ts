import { ResourceModel } from "../models/ResourceModel";
import type { IResourceRepository } from "./interfaces/IResourceRepository";

export class ResourceRepository implements IResourceRepository {
  async findById(id: string): Promise<unknown | null> {
    return ResourceModel.findById(id).lean().exec();
  }

  async findAvailable(): Promise<unknown[]> {
    return ResourceModel.find({ available: true }).lean().exec();
  }
}
