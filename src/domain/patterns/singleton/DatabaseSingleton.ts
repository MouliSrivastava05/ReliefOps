import mongoose from "mongoose";

/** Singleton — single coordinated connection lifecycle (Atlas / replica set friendly) */
export class DatabaseSingleton {
  private static instance: DatabaseSingleton | null = null;

  private constructor() {}

  static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}
