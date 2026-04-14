export interface IRequestRepository {
  findById(id: string): Promise<any | null>;
  findAll(): Promise<any[]>;
  findQueuedOrdered(): Promise<any[]>;
}
