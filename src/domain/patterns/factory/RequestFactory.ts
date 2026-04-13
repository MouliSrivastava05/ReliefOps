import { CrisisRequest } from "../../request/CrisisRequest";
import { FoodRequest } from "../../request/FoodRequest";
import { MedicalRequest } from "../../request/MedicalRequest";
import { ShelterRequest } from "../../request/ShelterRequest";

export type RequestKind = "medical" | "shelter" | "food";

export class RequestFactory {
  static create(
    kind: RequestKind,
    id: string,
    citizenId: string,
    severity: number
  ): CrisisRequest {
    switch (kind) {
      case "medical":
        return new MedicalRequest(id, citizenId, severity);
      case "shelter":
        return new ShelterRequest(id, citizenId, severity);
      case "food":
        return new FoodRequest(id, citizenId, severity);
      default: {
        const _exhaustive: never = kind;
        return _exhaustive;
      }
    }
  }
}
