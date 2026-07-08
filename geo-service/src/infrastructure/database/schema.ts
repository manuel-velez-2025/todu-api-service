import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const placeSummaries = pgTable('place_summaries', {
  placeId: varchar('place_id', { length: 500 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 500 }).notNull(),
  tip: text('tip').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
