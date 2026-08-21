/* eslint-disable drizzle/enforce-delete-with-where */
import { faker } from '@faker-js/faker';
import chalk from 'chalk';
import { createId } from '@paralleldrive/cuid2';

import { db } from './connection';
import {
  users,
  restaurants,
  authLinks,
  products,
  orders,
  orderProducts,
} from './schema';

await db.delete(restaurants);
await db.delete(orderProducts);
await db.delete(orders);
await db.delete(products);
await db.delete(authLinks);
await db.delete(users);

console.log(chalk.yellowBright('✔  Database reset '));

const [customer1, customer2] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'customer',
    },
  ])
  .returning();

console.log(chalk.yellowBright('✔  Seeded customers '));

const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@test.local',
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  });

console.log(chalk.yellowBright('✔  Seeded managers '));

const [restaurant] = await db
  .insert(restaurants)
  .values([
    {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
      managerId: manager?.id,
    },
  ])
  .returning();

console.log(chalk.yellowBright('✔  Seeded restaurants '));

const restaurantId = restaurant ? restaurant.id : '';

function generateProduct() {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    restaurantId,
    priceInCents: Number(faker.commerce.price({ min: 140, max: 490, dec: 0 })),
  };
}

const availableProducts = await db
  .insert(products)
  .values([
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
    generateProduct(),
  ])
  .returning();

console.log(chalk.yellowBright('✔  Seeded products '));

type OrderProductInsert = typeof orderProducts.$inferInsert;
type OrderInsert = typeof orders.$inferInsert;

const orderProductsToInsert: OrderProductInsert[] = [];
const ordersToInsert: OrderInsert[] = [];

if (!availableProducts) {
  throw new Error('[seed] products was not created.');
}

if (!customer1 || !customer2) {
  throw new Error('[seed] customers was not created.');
}

for (let i = 0; i < 200; i++) {
  const orderId = createId();

  const fakeOrderProducuts = faker.helpers.arrayElements(availableProducts, {
    min: 1,
    max: 3,
  });

  let totalInCents = 0;

  fakeOrderProducuts.forEach((orderProduct) => {
    const quantity = faker.number.int({ min: 1, max: 3 });

    totalInCents += orderProduct.priceInCents * quantity;

    orderProductsToInsert.push({
      orderId,
      productId: orderProduct.id,
      priceInCents: orderProduct.priceInCents,
      quantity,
    });
  });

  ordersToInsert.push({
    id: orderId,
    customerId: faker.helpers.arrayElement([customer1?.id, customer2?.id]),
    restaurantId,
    totalInCents,
    status: faker.helpers.arrayElement([
      'pending',
      'processing',
      'delivering',
      'delivered',
      'canceled',
    ]),
    createdAt: faker.date.recent({ days: 40 }),
  });
}

await db.insert(orders).values(ordersToInsert);
console.log(chalk.yellowBright('✔  Seeded orders '));

await db.insert(orderProducts).values(orderProductsToInsert);
console.log(chalk.yellowBright('✔  Seeded ordersProducts '));

console.log(chalk.greenBright('✔  Database seeded successfully '));

process.exit();
