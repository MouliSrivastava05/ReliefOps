/** Request lifecycle — State pattern (valid transitions enforced in RequestStateMachine) */
export const REQUEST_STATES = [
  "CREATED",
  "VALIDATED",
  "QUEUED",
  "ALLOCATED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type RequestState = (typeof REQUEST_STATES)[number];
