import { nearestResourceId } from "@/utils/distance";
import type { IRequestRepository } from "../../repositories/interfaces/IRequestRepository";
import type { IResourceRepository } from "../../repositories/interfaces/IResourceRepository";
import { VolunteerRepository } from "../../repositories/VolunteerRepository";
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

    if (req.type === "volunteer") {
      const volRepo = new VolunteerRepository();
      const pool = await volRepo.findAvailable();
      const volunteerId = nearestResourceId(req.lat, req.lng, pool);
      if (!volunteerId) return null;
      return { resourceId: volunteerId };
    }

    const pool = await this.resources.findAvailableByType(req.type);
    const resourceId = nearestResourceId(req.lat, req.lng, pool);
    if (!resourceId) return null;
    return { resourceId };
  }
}
