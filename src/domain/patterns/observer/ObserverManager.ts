import type { IObserver } from "./IObserver";

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
