import { CrisisRequest } from "./CrisisRequest";

export class FoodRequest extends CrisisRequest {
  getResourceType(): "food" {
    return "food";
  }
}
