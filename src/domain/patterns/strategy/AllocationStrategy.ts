export interface AllocationStrategy {
  allocate(requestId: string): Promise<string | null>;
}
