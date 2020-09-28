import Database from '../interfaces/database.interface';
import Exchange from '../exchange/exchange.interface';

class MemoryDatabase {
  private static instance: MemoryDatabase;
  private data: Database;

  private constructor() {
    this.data = {
      exchanges: [],
    };
  }

  public static getInstance(): MemoryDatabase {
    if (!MemoryDatabase.instance) {
      MemoryDatabase.instance = new MemoryDatabase();
    }

    return MemoryDatabase.instance;
  }

  public getData() {
    return this.data;
  }
}

export default MemoryDatabase;
