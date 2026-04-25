import type { RequestType } from "@/types/request.types";

export type RequestRecord = {
  _id: { toString(): string };
  citizenId: string;
  type: RequestType;
  status: string;
  severity: number;
  lat: number;
  lng: number;
  description?: string;
  locationKey?: string;
  createdAt?: Date;
  isResourceRequest?: boolean;
  unitsNeeded?: number;
};

export interface IRequestRepository {
  findById(id: string): Promise<RequestRecord | null>;
  findAll(): Promise<RequestRecord[]>;
  create(input: {
    citizenId: string;
    type: RequestType;
    status: string;
    severity: number;
    description: string;
    lat: number;
    lng: number;
    locationKey: string;
    isResourceRequest?: boolean;
    unitsNeeded?: number;
  }): Promise<string>;
  findQueuedOrdered(): Promise<RequestRecord[]>;
  updateStatus(
    id: string,
    fromStatus: string,
    toStatus: string,
  ): Promise<boolean>;
  findRecentDuplicate(
    citizenId: string,
    type: string,
    locationKey: string,
    since: Date,
  ): Promise<RequestRecord | null>;
}
