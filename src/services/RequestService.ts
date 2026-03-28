import type { IRequestRepository } from "@/domain/repositories/interfaces/IRequestRepository";

export class RequestService {
  constructor(private readonly requests: IRequestRepository) {}

  list() {
    return this.requests.findAll();
  }
}
