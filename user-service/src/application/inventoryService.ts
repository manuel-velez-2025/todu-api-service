import { z } from 'zod';
import { IInventoryRepository } from './IInventoryRepository';
import { IUserRepository } from './IUserRepository';
import { InventoryItem, InventoryItemId } from '../domain/user';
import { v4 as uuid } from 'uuid';

const INVENTORY_ITEMS: InventoryItemId[] = [
  'halloween', 'bunny', 'ninja', 'robot',
  'princess', 'pirate', 'superhero', 'wizard',
];

/**
 * Catálogo de accesorios con nombre para mostrar, costo en XP y descripción.
 */
export const ITEM_CATALOG: Record<InventoryItemId, { nombre: string; costo: number; descripcion: string }> = {
  halloween: { nombre: '🎃 Halloween', costo: 50, descripcion: 'Disfraz de Halloween espeluznante' },
  bunny:    { nombre: '🐰 Bunny',    costo: 75, descripcion: 'Orejas de conejo tiernas' },
  ninja:    { nombre: '🥷 Ninja',    costo: 100, descripcion: 'Disfraz de ninja sigiloso' },
  robot:    { nombre: '🤖 Robot',    costo: 150, descripcion: 'Traje robótico futurista' },
  princess: { nombre: '👸 Princess', costo: 200, descripcion: 'Corona y vestido de princesa' },
  pirate:   { nombre: '🏴‍☠️ Pirate', costo: 250, descripcion: 'Sombrero y espada de pirata' },
  superhero:{ nombre: '🦸 Superhéroe', costo: 300, descripcion: 'Capa de superhéroe' },
  wizard:   { nombre: '🧙 Mago',     costo: 400, descripcion: 'Túnica y sombrero de mago' },
};

export const equipItemSchema = z.object({
  itemId: z.string().refine(
    (val) => (INVENTORY_ITEMS as string[]).includes(val),
    { message: `Item inválido. Válidos: ${INVENTORY_ITEMS.join(', ')}` },
  ),
});

export interface InventarioCompleto {
  /** Lista de todos los items del catálogo con su estado */
  items: Array<{
    itemId: InventoryItemId;
    nombre: string;
    costo: number;
    descripcion: string;
    desbloqueado: boolean;
    equipado: boolean;
  }>;
  /** ID del item actualmente equipado (null si ninguno) */
  itemEquipado: string | null;
}

export class InventoryService {
  constructor(
    private inventoryRepo: IInventoryRepository,
    private userRepo: IUserRepository,
  ) {}

  /**
   * GET /inventory — Devuelve el catálogo completo con estado de desbloqueo y equipamiento.
   */
  async getInventory(userId: string): Promise<InventarioCompleto> {
    const userItems = await this.inventoryRepo.findByUserId(userId);
    const itemEquipado = userItems.find((i) => i.isEquipped);
    const ownedItemIds = new Set(userItems.map((i) => i.itemId));

    const items = INVENTORY_ITEMS.map((itemId) => ({
      itemId,
      nombre: ITEM_CATALOG[itemId].nombre,
      costo: ITEM_CATALOG[itemId].costo,
      descripcion: ITEM_CATALOG[itemId].descripcion,
      desbloqueado: ownedItemIds.has(itemId),
      equipado: itemEquipado?.itemId === itemId,
    }));

    return {
      items,
      itemEquipado: itemEquipado?.itemId ?? null,
    };
  }

  async unlockItem(userId: string, itemId: InventoryItemId): Promise<InventoryItem> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw Object.assign(new Error('Usuario no encontrado'), { statusCode: 404 });
    }

    if (!INVENTORY_ITEMS.includes(itemId)) {
      throw Object.assign(
        new Error(`Item inválido. Válidos: ${INVENTORY_ITEMS.join(', ')}`),
        { statusCode: 400 },
      );
    }

    const existing = await this.inventoryRepo.findByUserId(userId);
    const alreadyHas = existing.find((i) => i.itemId === itemId);
    if (alreadyHas) {
      throw Object.assign(new Error('Ya posees este item'), { statusCode: 409 });
    }

    const costo = ITEM_CATALOG[itemId].costo;

    await this.userRepo.deductXpAtomically(userId, costo);

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
