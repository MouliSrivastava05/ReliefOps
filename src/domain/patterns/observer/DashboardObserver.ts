import type { AllocationEvent } from "./ObserverManager";
import type { IObserver } from "./IObserver";

const recent: AllocationEvent[] = [];
const MAX = 50;

/** In-process feed for admin dashboard demos (serverless: per-instance) */
export class DashboardObserver implements IObserver {
  update(payload: unknown): void {
    if (
      payload &&
      typeof payload === "object" &&
      (payload as AllocationEvent).type === "allocation"
    ) {
      const e = payload as AllocationEvent;
      recent.unshift(e);
      if (recent.length > MAX) recent.pop();
    }
  }

  static snapshot(): AllocationEvent[] {
    return [...recent];
  }
}
