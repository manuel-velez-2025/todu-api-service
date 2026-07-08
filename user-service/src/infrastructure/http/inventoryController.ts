import { Request, Response } from 'express';
import { InventoryService, equipItemSchema } from '../../application/inventoryService';
import { InventoryItemId } from '../../domain/user';

function isZodError(error: any): boolean {
  return error?.name === 'ZodError' && error?.issues !== undefined;
}

function getZodMessage(error: any): string {
  return error?.issues?.[0]?.message || 'Error de validación';
}

export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  getInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const inventario = await this.inventoryService.getInventory(userId);
      res.json(inventario);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: 'Error al obtener inventario',
        mensaje: error.message || 'Error interno',
      });
    }
  };

  unlockItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { itemId } = equipItemSchema.parse(req.body);
      const item = await this.inventoryService.unlockItem(userId, itemId as InventoryItemId);
      res.status(201).json({
        mensaje: 'Item desbloqueado correctamente',
        item,
      });
    } catch (error: any) {
      if (isZodError(error)) {
        res.status(400).json({ error: 'Datos inválidos', mensaje: getZodMessage(error) });
        return;
      }
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: 'Error al desbloquear item',
        mensaje: error.message || 'Error interno',
      });
    }
  };

  addItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { itemId } = equipItemSchema.parse(req.body);
      const item = await this.inventoryService.addItem(userId, itemId as InventoryItemId);
      res.status(201).json(item);
    } catch (error: any) {
      if (isZodError(error)) {
        res.status(400).json({ error: 'Datos inválidos', mensaje: getZodMessage(error) });
        return;
      }
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: 'Error al agregar item',
        mensaje: error.message || 'Error interno',
      });
    }
  };

  equipItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { itemId } = equipItemSchema.parse(req.body);
      const item = await this.inventoryService.equipItem(userId, itemId as InventoryItemId);
      res.json(item);
    } catch (error: any) {
      if (isZodError(error)) {
        res.status(400).json({ error: 'Datos inválidos', mensaje: getZodMessage(error) });
        return;
      }
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: 'Error al equipar item',
        mensaje: error.message || 'Error interno',
      });
    }
  };

  unequipItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { itemId } = equipItemSchema.parse(req.body);
      await this.inventoryService.unequipItem(userId, itemId as InventoryItemId);
      res.json({ mensaje: 'Item desequipado exitosamente' });
    } catch (error: any) {
      if (isZodError(error)) {
        res.status(400).json({ error: 'Datos inválidos', mensaje: getZodMessage(error) });
        return;
      }
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: 'Error al desequipar item',
        mensaje: error.message || 'Error interno',
      });
    }
  };
}


