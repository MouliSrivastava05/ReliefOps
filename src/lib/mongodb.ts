import mongoose from "mongoose";
import { DashboardObserver } from "@/domain/patterns/observer/DashboardObserver";
import { globalObserverManager } from "@/domain/patterns/observer/ObserverManager";

let observerAttached = false;

export function ensureDashboardObserver(): void {
  if (observerAttached) return;
  globalObserverManager.subscribe(new DashboardObserver());
  observerAttached = true;
}

// Store the memory server and URI on globalThis so they survive
// Next.js hot-module reloads and are shared across all API route contexts.
const g = global as typeof global & {
  _mongoMemoryServer?: any;
  _mongoUri?: string;
};

export async function connectMongo(): Promise<void> {
  ensureDashboardObserver();

  let uri = process.env.MONGODB_URI;

  if (!uri) {
    if (!g._mongoUri) {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      g._mongoMemoryServer = await MongoMemoryServer.create();
      g._mongoUri = g._mongoMemoryServer.getUri();
      console.log("Memory DB started at", g._mongoUri);
    }
    uri = g._mongoUri;
  }

  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(uri as string);
}

export function isMongoConfigured(): boolean {
  return true; // Always falls back to in-memory server if no MONGODB_URI set
}
