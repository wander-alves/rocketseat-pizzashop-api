import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

import { orders, products } from '.';

const orderProducts = pgTable('order_products', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, {
      onDelete: 'cascade',
    }),
  productId: text('product_id').references(() => products.id, {
    onDelete: 'set default',
  }),
  priceInCents: integer('price_in_cents').notNull(),
  quantity: integer('quantity').notNull(),
});

const orderProductsRelations = relations(orderProducts, ({ one }) => {
  return {
    order: one(orders, {
      fields: [orderProducts.orderId],
      references: [orders.id],
      relationName: 'order_product_order',
    }),
    product: one(products, {
      fields: [orderProducts.productId],
      references: [products.id],
      relationName: 'order_product_product',
    }),
  };
});

export { orderProducts, orderProductsRelations };
