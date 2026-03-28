export class DatabaseSingleton {
  private static instance: DatabaseSingleton | null = null;

  private constructor() {}

  static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }
}
