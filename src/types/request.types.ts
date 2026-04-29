export type RequestType = "medical" | "shelter" | "food" | "volunteer";

export type RequestDTO = {
  id: string;
  citizenId: string;
  type: RequestType;
  status: string;
};
