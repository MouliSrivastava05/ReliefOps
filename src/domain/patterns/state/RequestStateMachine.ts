import type { RequestState } from "./RequestStates";

export class RequestStateMachine {
  constructor(private state: RequestState) {}

  getState(): RequestState {
    return this.state;
  }

  transition(next: RequestState): void {
    this.state = next;
  }
}
