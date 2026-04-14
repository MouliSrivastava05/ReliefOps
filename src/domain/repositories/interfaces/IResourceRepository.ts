import type { RequestType } from "@/types/request.types";

export type ResourceRecord = {
  _id: { toString(): string };
  name: string;
  type: RequestType;
  quantityAvailable: number;
  lat: number;
  lng: number;
};

export interface IResourceRepository {
  findById(id: string): Promise<ResourceRecord | null>;
  findAll(): Promise<ResourceRecord[]>;
  findAvailable(): Promise<ResourceRecord[]>;
  findAvailableByType(type: RequestType): Promise<ResourceRecord[]>;
  /** Atomic decrement — conflict-free when only matching docs with stock */
  reserveOneUnit(id: string): Promise<boolean>;
  /** Compensation if allocation persistence fails after reserve */
  releaseOneUnit(id: string): Promise<void>;
}
