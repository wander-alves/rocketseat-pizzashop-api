import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';


const restaurant = pgTable('restaurants', {
  id: text('id').$defaultFn(()=> createId()).primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export { restaurant };