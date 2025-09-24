import { Firestore } from "firebase-admin/firestore";
import { v4 as uuid } from "uuid";

import { IDataStore } from "../interfaces/data-store.interface";

export class FirestoreRepository<T extends { id: string }> implements IDataStore<T> {
  constructor(private readonly firestore: Firestore, private readonly collectionName: string) {}

  private collection() {
    return this.firestore.collection(this.collectionName);
  }

  async create(data: Omit<T, "id"> & { id?: string }): Promise<T> {
    const id = data.id ?? uuid();
    const doc = this.collection().doc(id);
    await doc.set({ ...data, id } as T);
    const snapshot = await doc.get();
    return snapshot.data() as T;
  }

  async findAll(query: Record<string, unknown> = {}): Promise<T[]> {
    let collectionQuery: FirebaseFirestore.Query = this.collection();
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      collectionQuery = collectionQuery.where(key, "==", value);
    });
    const snapshot = await collectionQuery.get();
    return snapshot.docs.map((doc) => doc.data() as T);
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.collection().doc(id).get();
    return doc.exists ? ((doc.data() as T) ?? null) : null;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const docRef = this.collection().doc(id);
    await docRef.set(data, { merge: true });
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      throw new Error(`Document with id ${id} not found in ${this.collectionName}`);
    }
    return snapshot.data() as T;
  }

  async delete(id: string): Promise<void> {
    await this.collection().doc(id).delete();
  }
}
