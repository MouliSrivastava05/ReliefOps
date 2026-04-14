export type AllocationPickResult = { resourceId: string };

/** Strategy pattern — swappable allocation / matching logic */
export interface AllocationStrategy {
  allocate(requestId: string): Promise<AllocationPickResult | null>;
}
