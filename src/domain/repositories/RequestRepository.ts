import { RequestModel } from "../models/RequestModel";
import type {
  IRequestRepository,
  RequestRecord,
} from "./interfaces/IRequestRepository";
import type { RequestType } from "@/types/request.types";

function toRecord(doc: unknown): RequestRecord | null {
  if (!doc || typeof doc !== "object") return null;
  const d = doc as Record<string, unknown>;
  const id = d._id as { toString(): string } | undefined;
  if (!id) return null;
  return {
    _id: id,
    citizenId: String(d.citizenId),
    type: d.type as RequestType,
    status: String(d.status),
    severity: Number(d.severity),
    lat: Number(d.lat),
    lng: Number(d.lng),
    description: d.description ? String(d.description) : "",
    locationKey: d.locationKey ? String(d.locationKey) : "",
    createdAt: d.createdAt instanceof Date ? d.createdAt : undefined,
    isResourceRequest: Boolean(d.isResourceRequest),
    unitsNeeded: Number(d.unitsNeeded || 0),
  };
}

export class RequestRepository implements IRequestRepository {
  async findById(id: string): Promise<RequestRecord | null> {
    const doc = await RequestModel.findById(id).lean().exec();
    return toRecord(doc);
  }

  async findAll(): Promise<RequestRecord[]> {
    const docs = await RequestModel.find().sort({ createdAt: -1 }).lean().exec();
    return docs.map((d) => toRecord(d)!).filter(Boolean);
  }

  async create(input: {
    citizenId: string;
    type: RequestType;
    status: string;
    severity: number;
    description: string;
    lat: number;
    lng: number;
    locationKey: string;
    isResourceRequest?: boolean;
    unitsNeeded?: number;
  }): Promise<string> {
    const created = await RequestModel.create(input);
    return created._id.toString();
  }

  async findQueuedOrdered(): Promise<RequestRecord[]> {
    const docs = await RequestModel.find({ status: "QUEUED" })
      .sort({ severity: -1, createdAt: 1 })
      .lean()
      .exec();
    return docs.map((d) => toRecord(d)!).filter(Boolean);
  }

  async updateStatus(
    id: string,
    fromStatus: string,
    toStatus: string,
  ): Promise<boolean> {
    const res = await RequestModel.updateOne(
      { _id: id, status: fromStatus },
      { $set: { status: toStatus } },
    );
    return res.modifiedCount === 1;
  }

  async findRecentDuplicate(
    citizenId: string,
    type: string,
    locationKey: string,
    since: Date,
  ): Promise<RequestRecord | null> {
    const doc = await RequestModel.findOne({
      citizenId,
      type,
      locationKey,
      createdAt: { $gte: since },
    })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    return toRecord(doc);
  }
}
