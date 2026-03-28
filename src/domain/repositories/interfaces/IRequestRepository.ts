export interface IRequestRepository {
  findById(id: string): Promise<unknown | null>;
  findAll(): Promise<unknown[]>;
}
