import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash'),
  authProvider: varchar('auth_provider', { length: 10 }).notNull().default('email'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
