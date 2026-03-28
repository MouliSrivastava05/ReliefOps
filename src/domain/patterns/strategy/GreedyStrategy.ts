import type { AllocationStrategy } from "./AllocationStrategy";

/** Nearest available resource */
export class GreedyStrategy implements AllocationStrategy {
  async allocate(_requestId: string): Promise<string | null> {
    return null;
  }
}
