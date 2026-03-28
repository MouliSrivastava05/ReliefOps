import type { IObserver } from "./IObserver";

export class DashboardObserver implements IObserver {
  update(_payload: unknown): void {
    // Refresh dashboard state
  }
}
