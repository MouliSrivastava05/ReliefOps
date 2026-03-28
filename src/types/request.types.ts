export type RequestType = "medical" | "shelter" | "food";

export type RequestDTO = {
  id: string;
  citizenId: string;
  type: RequestType;
  status: string;
};
