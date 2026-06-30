import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  nombreUsuario: varchar('nombre_usuario', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  googleId: varchar('google_id', { length: 255 }),
  fechaCreacion: timestamp('created_at').defaultNow(),
});
