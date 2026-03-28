export interface IResourceRepository {
  findById(id: string): Promise<unknown | null>;
  findAvailable(): Promise<unknown[]>;
}
