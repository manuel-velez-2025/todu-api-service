import { z } from 'zod';
import { IInventoryRepository } from './IInventoryRepository';
import { IUserRepository } from './IUserRepository';
import { InventoryItem, InventoryItemId } from '../domain/user';
import { v4 as uuid } from 'uuid';

const INVENTORY_ITEMS: InventoryItemId[] = [
  'halloween', 'bunny', 'ninja', 'robot',
  'princess', 'pirate', 'superhero', 'wizard',
];

export const equipItemSchema = z.object({
  itemId: z.string().refine(
    (val) => (INVENTORY_ITEMS as string[]).includes(val),
    { message: `Item inválido. Válidos: ${INVENTORY_ITEMS.join(', ')}` },
  ),
});


export class InventoryService {
  constructor(
    private inventoryRepo: IInventoryRepository,
    private userRepo: IUserRepository,
  ) {}

  async getInventory(userId: string): Promise<InventoryItem[]> {
    return this.inventoryRepo.findByUserId(userId);
  }

  async addItem(userId: string, itemId: InventoryItemId): Promise<InventoryItem> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });
    }

    const existing = await this.inventoryRepo.findByUserId(userId);
    const alreadyHas = existing.find((i) => i.itemId === itemId);
    if (alreadyHas) {
      throw Object.assign(new Error('Ya posees este item'), { statusCode: 400 });
    }

    const newItem: InventoryItem = {
      id: uuid(),
      userId,
      itemId,
      isEquipped: false,
      createdAt: new Date(),
    };

    await this.inventoryRepo.create(newItem);
    return newItem;
  }

  async equipItem(userId: string, itemId: InventoryItemId): Promise<InventoryItem> {
    const items = await this.inventoryRepo.findByUserId(userId);
    const targetItem = items.find((i) => i.itemId === itemId);

    if (!targetItem) {
      throw Object.assign(new Error('No posees este item'), { statusCode: 404 });
    }

    for (const item of items) {
      if (item.isEquipped && item.id !== targetItem.id) {
        await this.inventoryRepo.update(item.id, { isEquipped: false });
      }
    }

    await this.inventoryRepo.update(targetItem.id, { isEquipped: true });
    targetItem.isEquipped = true;

    return targetItem;
  }

  async unequipItem(userId: string, itemId: InventoryItemId): Promise<void> {
    const items = await this.inventoryRepo.findByUserId(userId);
    const targetItem = items.find((i) => i.itemId === itemId && i.isEquipped);

    if (!targetItem) {
      throw Object.assign(new Error('No tienes equipado este item'), { statusCode: 404 });
    }

    await this.inventoryRepo.update(targetItem.id, { isEquipped: false });
  }
}
