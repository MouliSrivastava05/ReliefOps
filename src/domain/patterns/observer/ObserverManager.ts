import type { IObserver } from "./IObserver";

export type AllocationEvent = {
  type: "allocation";
  requestId: string;
  resourceId: string;
  strategy: string;
  at: string;
};

/** Observer pattern — decouple allocation from dashboard refresh hooks */
export class ObserverManager {
  private readonly observers: IObserver[] = [];

  subscribe(observer: IObserver): void {
    this.observers.push(observer);
  }

  notify(payload: unknown): void {
    for (const o of this.observers) {
      o.update(payload);
    }
  }
}

export const globalObserverManager = new ObserverManager();
