import { nearestResourceId } from "@/utils/distance";
import type { IRequestRepository } from "../../repositories/interfaces/IRequestRepository";
import type { IResourceRepository } from "../../repositories/interfaces/IResourceRepository";
import type { AllocationPickResult, AllocationStrategy } from "./AllocationStrategy";

/**
 * Severity-first queue: only the head of the priority queue (severity desc)
 * may be allocated — reduces starvation of critical cases vs pure greedy ordering.
 */
export class SeverityStrategy implements AllocationStrategy {
  constructor(
    private readonly requests: IRequestRepository,
    private readonly resources: IResourceRepository,
  ) {}

  async allocate(requestId: string): Promise<AllocationPickResult | null> {
    const queue = await this.requests.findQueuedOrdered();
    if (!queue.length) return null;
    const head = queue[0];
    if (head._id.toString() !== requestId) return null;
    const pool = await this.resources.findAvailableByType(head.type);
    const resourceId = nearestResourceId(head.lat, head.lng, pool);
    if (!resourceId) return null;
    return { resourceId };
  }
}
