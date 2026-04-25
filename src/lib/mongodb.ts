import mongoose from "mongoose";
import { DashboardObserver } from "@/domain/patterns/observer/DashboardObserver";
import { globalObserverManager } from "@/domain/patterns/observer/ObserverManager";

let observerAttached = false;

export function ensureDashboardObserver(): void {
  if (observerAttached) return;
  globalObserverManager.subscribe(new DashboardObserver());
  observerAttached = true;
}

let uri = process.env.MONGODB_URI;
let memoryServer: any = null;

export async function connectMongo(): Promise<void> {
  ensureDashboardObserver();
  if (!uri) {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    if (!memoryServer) {
        memoryServer = await MongoMemoryServer.create();
        uri = memoryServer.getUri();
        console.log("Memory DB started at", uri);
    } else {
        uri = memoryServer.getUri();
    }
  }
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(uri as string);
}

export function isMongoConfigured(): boolean {
  return true; // We always fallback to memory server now
}
