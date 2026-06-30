import { pgTable, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core';

export const tareas = pgTable('tasks', {
  id: varchar('id', { length: 36 }).primaryKey(),
  usuarioId: varchar('user_id', { length: 36 }).notNull(),
  titulo: varchar('title', { length: 255 }).notNull(),
  descripcion: text('description'),
  xpValor: integer('xp_value').default(0),
  estado: varchar('status', { length: 20 }).default('pending').notNull(),
  urlEvidencia: varchar('proof_url', { length: 500 }),
  proofStatus: varchar('proof_status', { length: 20 }),
  proofReason: text('proof_reason'),
  proofConfidence: varchar('proof_confidence', { length: 10 }),
  fechaCreacion: timestamp('created_at').defaultNow(),
});
