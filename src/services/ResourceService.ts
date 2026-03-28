import type { IResourceRepository } from "@/domain/repositories/interfaces/IResourceRepository";

export class ResourceService {
  constructor(private readonly resources: IResourceRepository) {}

  listAvailable() {
    return this.resources.findAvailable();
  }
}
