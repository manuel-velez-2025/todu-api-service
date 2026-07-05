import { InventoryItem } from '../domain/user';

export interface IInventoryRepository {
  findByUserId(userId: string): Promise<InventoryItem[]>;
  findById(id: string): Promise<InventoryItem | null>;
  create(item: InventoryItem): Promise<void>;
  update(id: string, data: Partial<InventoryItem>): Promise<void>;
  delete(id: string): Promise<void>;
  findEquippedByUserId(userId: string): Promise<InventoryItem | null>;
}
