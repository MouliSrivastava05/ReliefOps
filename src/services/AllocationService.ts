import type { AllocationStrategy } from "@/domain/patterns/strategy/AllocationStrategy";

export class AllocationService {
  constructor(private readonly strategy: AllocationStrategy) {}

  run(requestId: string) {
    return this.strategy.allocate(requestId);
  }
}
