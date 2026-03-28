import type { AllocationStrategy } from "./AllocationStrategy";

/** Highest priority first */
export class SeverityStrategy implements AllocationStrategy {
  async allocate(_requestId: string): Promise<string | null> {
    return null;
  }
}
