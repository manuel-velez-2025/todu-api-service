import { eq, and } from 'drizzle-orm';
import { db } from './db';
import { inventarios } from './schema';
import { InventoryItem, InventoryItemId } from '../../domain/user';
import { IInventoryRepository } from '../../application/IInventoryRepository';

function mapRowToInventoryItem(row: Record<string, unknown>): InventoryItem {
  return {
    id: row.id as string,
    userId: row.userId as string,
    itemId: row.itemId as InventoryItemId,
    isEquipped: row.isEquipped as boolean,
    createdAt: row.createdAt as Date,
  };
}

export class InventoryRepository implements IInventoryRepository {
  async findByUserId(userId: string): Promise<InventoryItem[]> {
    const result = await db
      .select()
      .from(inventarios)
      .where(eq(inventarios.userId, userId));
    return result.map((row) => mapRowToInventoryItem(row as Record<string, unknown>));
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const result = await db
      .select()
      .from(inventarios)
      .where(eq(inventarios.id, id));
    return result[0] ? mapRowToInventoryItem(result[0] as Record<string, unknown>) : null;
  }

  async create(item: InventoryItem): Promise<void> {
    await db.insert(inventarios).values({
      id: item.id,
      userId: item.userId,
      itemId: item.itemId,
      isEquipped: item.isEquipped,
      createdAt: item.createdAt,
    });
  }

  async update(id: string, data: Partial<InventoryItem>): Promise<void> {
    const updateData: Record<string, unknown> = {};
    if (data.itemId !== undefined) updateData['itemId'] = data.itemId;
    if (data.isEquipped !== undefined) updateData['isEquipped'] = data.isEquipped;

    await db.update(inventarios).set(updateData).where(eq(inventarios.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(inventarios).where(eq(inventarios.id, id));
  }

  async findEquippedByUserId(userId: string): Promise<InventoryItem | null> {
    const result = await db
      .select()
      .from(inventarios)
      .where(and(eq(inventarios.userId, userId), eq(inventarios.isEquipped, true)));
    return result[0] ? mapRowToInventoryItem(result[0] as Record<string, unknown>) : null;
  }
}
