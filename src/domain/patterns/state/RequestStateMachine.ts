import type { RequestState } from "./RequestStates";

const ALLOWED: Record<RequestState, RequestState[]> = {
  CREATED: ["VALIDATED", "CANCELLED"],
  VALIDATED: ["QUEUED", "CANCELLED"],
  QUEUED: ["ALLOCATED", "CANCELLED"],
  ALLOCATED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export class RequestStateMachine {
  constructor(private state: RequestState) {}

  getState(): RequestState {
    return this.state;
  }

  canTransition(next: RequestState): boolean {
    return ALLOWED[this.state].includes(next);
  }

  /** Returns false if transition is illegal */
  transition(next: RequestState): boolean {
    if (!this.canTransition(next)) return false;
    this.state = next;
    return true;
  }
}
