import { z } from 'zod';

export const createTaskSchema = z.object({
    titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    descripcion: z.string().optional(),
    xpValor: z.number().int().positive("El XP debe ser un número positivo"),
});