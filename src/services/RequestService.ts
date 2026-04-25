import type { IRequestRepository } from "@/domain/repositories/interfaces/IRequestRepository";
import type { RequestType } from "@/types/request.types";

export class RequestService {
  constructor(private readonly requests: IRequestRepository) {}

  list() {
    return this.requests.findAll();
  }

  async createAndQueue(data: {
    citizenId: string;
    type: string;
    severity: number;
    description: string;
    lat: number;
    lng: number;
    isResourceRequest?: boolean;
    unitsNeeded?: number;
  }): Promise<{ id: string; duplicate?: boolean } | { error: string }> {
    const locationKey = `${data.lat.toFixed(4)},${data.lng.toFixed(4)}`;

    // Anti-spam: check for duplicates in last 5 mins
    const since = new Date(Date.now() - 5 * 60 * 1000);
    const existing = await this.requests.findRecentDuplicate(
      data.citizenId,
      data.type,
      locationKey,
      since,
    );

    if (existing) {
      return { id: existing._id.toString(), duplicate: true };
    }

    const id = await this.requests.create({
      ...data,
      type: data.type as RequestType,
      status: "QUEUED",
      locationKey,
    });

    return { id };
  }
}
