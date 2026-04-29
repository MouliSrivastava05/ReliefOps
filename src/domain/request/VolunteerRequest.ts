import { CrisisRequest } from "./CrisisRequest";
import type { RequestType } from "@/types/request.types";

export class VolunteerRequest extends CrisisRequest {
  constructor(id: string, citizenId: string, severity: number) {
    super(id, citizenId, severity);
  }

  getResourceType(): RequestType {
    return "volunteer";
  }

  override priorityWeight(): number {
    return super.priorityWeight() + 2;
  }
}
