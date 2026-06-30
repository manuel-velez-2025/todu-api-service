import { pgTable, varchar, integer, timestamp, date } from 'drizzle-orm/pg-core';

export const userProgress = pgTable('user_progress', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().unique(),
  xpActual: integer('xp_actual').default(0).notNull(),
  nivel: integer('nivel').default(1).notNull(),
  rachaActual: integer('racha_actual').default(0).notNull(),
  ultimaActividad: timestamp('ultima_actividad').defaultNow().notNull(),
  tareasCompletadas: integer('tareas_completadas').default(0).notNull(),
  fechaCreacion: timestamp('created_at').defaultNow().notNull(),
});
