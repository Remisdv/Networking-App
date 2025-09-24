﻿export interface IDataStore<T> {
  create(data: T): Promise<T>;
  findAll(query?: Record<string, unknown>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
