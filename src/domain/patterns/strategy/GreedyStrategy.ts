import { nearestResourceId } from "@/utils/distance";
import type { IRequestRepository } from "../../repositories/interfaces/IRequestRepository";
import type { IResourceRepository } from "../../repositories/interfaces/IResourceRepository";
import type { AllocationPickResult, AllocationStrategy } from "./AllocationStrategy";

/** Nearest available compatible resource (distance-based greedy) */
export class GreedyStrategy implements AllocationStrategy {
  constructor(
    private readonly requests: IRequestRepository,
    private readonly resources: IResourceRepository,
  ) {}

  async allocate(requestId: string): Promise<AllocationPickResult | null> {
    const req = await this.requests.findById(requestId);
    if (!req || req.status !== "QUEUED") return null;
    const pool = await this.resources.findAvailableByType(req.type);
    const resourceId = nearestResourceId(req.lat, req.lng, pool);
    if (!resourceId) return null;
    return { resourceId };
  }
}
