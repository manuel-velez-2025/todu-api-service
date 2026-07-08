import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const robotState = pgTable('robot_state', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().unique(),
  emotion: varchar('emotion', { length: 20 }).notNull().default('sleepy'),
  expresion: varchar('expresion', { length: 20 }).notNull().default('neutral'),
  accesorio: varchar('accesorio', { length: 20 }).notNull().default('ninguno'),
  nivel: integer('nivel').default(1).notNull(),
  ultimaActividad: timestamp('ultima_actividad').defaultNow().notNull(),
  fechaCreacion: timestamp('created_at').defaultNow().notNull(),
});
