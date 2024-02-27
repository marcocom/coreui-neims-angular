export class WebStorage {
  constructor(private storage: Storage) {}

  public setItem<T = any>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public getItem<T = any>(key: string): T | null {
    try {
      const raw = this.storage.getItem(key);
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (err) {
      return null;
    }
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  public clear(): void {
    this.storage.clear();
  }
}
