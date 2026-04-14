import type { IResourceRepository } from "@/domain/repositories/interfaces/IResourceRepository";

export class ResourceService {
  constructor(private readonly resources: IResourceRepository) {}

  list() {
    return this.resources.findAll();
  }

  listAvailable() {
    return this.resources.findAvailable();
  }
}
