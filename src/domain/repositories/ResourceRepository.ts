import { ResourceModel } from "../models/ResourceModel";
import type {
  IResourceRepository,
  ResourceRecord,
} from "./interfaces/IResourceRepository";
import type { RequestType } from "@/types/request.types";

function toRecord(doc: unknown): ResourceRecord | null {
  if (!doc || typeof doc !== "object") return null;
  const d = doc as Record<string, unknown>;
  const id = d._id as { toString(): string } | undefined;
  if (!id) return null;
  return {
    _id: id,
    name: String(d.name),
    type: d.type as RequestType,
    quantityAvailable: Number(d.quantityAvailable ?? 0),
    lat: Number(d.lat),
    lng: Number(d.lng),
  };
}

export class ResourceRepository implements IResourceRepository {
  async findById(id: string): Promise<ResourceRecord | null> {
    const doc = await ResourceModel.findById(id).lean().exec();
    return toRecord(doc);
  }

  async findAll(): Promise<ResourceRecord[]> {
    const docs = await ResourceModel.find().sort({ name: 1 }).lean().exec();
    return docs.map((d) => toRecord(d)!).filter(Boolean);
  }

  async findAvailableByType(type: RequestType): Promise<ResourceRecord[]> {
    const docs = await ResourceModel.find({
      type,
      quantityAvailable: { $gte: 1 },
    })
      .lean()
      .exec();
    return docs.map((d) => toRecord(d)!).filter(Boolean);
  }

  async reserveOneUnit(id: string): Promise<boolean> {
    const res = await ResourceModel.findOneAndUpdate(
      { _id: id, quantityAvailable: { $gte: 1 } },
      { $inc: { quantityAvailable: -1 } },
      { new: true },
    ).exec();
    return !!res;
  }

  async releaseOneUnit(id: string): Promise<void> {
    await ResourceModel.updateOne(
      { _id: id },
      { $inc: { quantityAvailable: 1 } },
    ).exec();
  }
}
