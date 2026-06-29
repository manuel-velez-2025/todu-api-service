import { pgTable, varchar, text } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  nombreUsuario: varchar('nombre_usuario', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
});