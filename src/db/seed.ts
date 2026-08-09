import { faker } from '@faker-js/faker';
import chalk from 'chalk';

import { db } from './connection';
import { users, restaurants } from './schema';

await db.delete(users);
await db.delete(restaurants);
console.log(chalk.yellowBright('✔  Database reset '));

await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer'
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer'
  },
]);
console.log(chalk.yellowBright('✔  Created customers '));

const [manager] = await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: 'admin@test.local',
    role: 'manager'
  },
]).returning({
  id: users.id,
});
console.log(chalk.yellowBright('✔  Created managers '));

await db.insert(restaurants).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager?.id,
  }
]);



console.log(chalk.yellowBright('✔  Created restaurants '));
console.log(chalk.greenBright('✔  Database seeded successfully '));

process.exit();