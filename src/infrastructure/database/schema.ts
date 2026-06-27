import { pgTable, varchar, integer, timestamp, text } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  nombreUsuario: varchar('username', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  nivel: integer('level').default(1),
  xpTotal: integer('total_xp').default(0),
  fechaCreacion: timestamp('created_at').defaultNow(),
});

export const tareas = pgTable('tasks', {
  id: varchar('id', { length: 36 }).primaryKey(),
  usuarioId: varchar('user_id', { length: 36 }),
  titulo: varchar('title', { length: 255 }).notNull(),
  descripcion: text('description'),
  xpValor: integer('xp_value').default(0),
  estado: varchar('status', { length: 20 }).default('pending'),
  urlEvidencia: varchar('proof_url', { length: 255 }),
  fechaCreacion: timestamp('created_at').defaultNow(),
});