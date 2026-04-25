import { AllocationModel } from "@/domain/models/AllocationModel";
import type { ObserverManager } from "@/domain/patterns/observer/ObserverManager";
import type { AllocationStrategy } from "@/domain/patterns/strategy/AllocationStrategy";
import type { IRequestRepository } from "@/domain/repositories/interfaces/IRequestRepository";
import type { IResourceRepository } from "@/domain/repositories/interfaces/IResourceRepository";

/** Core matching engine — strategy + atomic resource reserve + observer notify */
export class AllocationService {
  constructor(
    private readonly strategy: AllocationStrategy,
    private readonly requests: IRequestRepository,
    private readonly resources: IResourceRepository,
    private readonly observers: ObserverManager,
  ) {}

  async run(requestId: string, strategyName: string) {
    const pick = await this.strategy.allocate(requestId);
    if (!pick) {
      return { ok: false as const, message: "No allocation candidate" };
    }

    const reserved = await this.resources.reserveOneUnit(pick.resourceId);
    if (!reserved) {
      return { ok: false as const, message: "Resource unavailable (race)" };
    }

    try {
      await AllocationModel.create({
        requestId,
        resourceId: pick.resourceId,
        strategy: strategyName,
      });
    } catch {
      await this.resources.releaseOneUnit(pick.resourceId);
      return { ok: false as const, message: "Duplicate allocation" };
    }

    const updated = await this.requests.updateStatus(
      requestId,
      "QUEUED",
      "ALLOCATED",
    );
    if (!updated) {
      await AllocationModel.deleteOne({ requestId });
      await this.resources.releaseOneUnit(pick.resourceId);
      return { ok: false as const, message: "Request state changed" };
    }

    this.observers.notify({
      type: "allocation",
      requestId,
      resourceId: pick.resourceId,
      strategy: strategyName,
      at: new Date().toISOString(),
    });

    return { ok: true as const, resourceId: pick.resourceId };
  }
}
