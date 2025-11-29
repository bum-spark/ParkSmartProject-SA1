export interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}