export const REQUEST_STATES = [
  "PENDING",
  "ASSIGNED",
  "RESOLVED",
  "CLOSED",
] as const;

export type RequestState = (typeof REQUEST_STATES)[number];
