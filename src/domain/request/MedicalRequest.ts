import { CrisisRequest } from "./CrisisRequest";

export class MedicalRequest extends CrisisRequest {
  getResourceType(): "medical" {
    return "medical";
  }

  override priorityWeight(): number {
    return super.priorityWeight() + 5;
  }
}
