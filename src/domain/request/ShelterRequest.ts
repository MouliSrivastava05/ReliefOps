import { CrisisRequest } from "./CrisisRequest";

export class ShelterRequest extends CrisisRequest {
  getResourceType(): "shelter" {
    return "shelter";
  }
}
