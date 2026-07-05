import { pgTable, varchar, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash'),
  authProvider: varchar('auth_provider', { length: 10 }).notNull().default('email'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  fechaNacimiento: varchar('fecha_nacimiento', { length: 10 }),
  xpTotal: integer('xp_total').notNull().default(0),
  xpActual: integer('xp_actual').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inventarios = pgTable('inventories', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  itemId: varchar('item_id', { length: 50 }).notNull(),
  isEquipped: boolean('is_equipped').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

