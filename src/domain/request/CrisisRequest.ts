import type { RequestType } from "@/types/request.types";

/** Abstract base — polymorphism via `resourceType` / `priorityWeight` on subclasses */
export abstract class CrisisRequest {
  constructor(
    public readonly id: string,
    public readonly citizenId: string,
    public readonly severity: number,
  ) {}

  abstract getResourceType(): RequestType;

  /** Higher = more urgent (used by severity-based queue ordering) */
  priorityWeight(): number {
    return this.severity * 10;
  }
}
