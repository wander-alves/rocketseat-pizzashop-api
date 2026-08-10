import { Elysia } from 'elysia';

import { env } from '../env';
import { db } from '../db/connection';
import { restaurants, users } from '../db/schema';

const app = new Elysia().post('/restaurants', async ({ body, set }) => {
  const { restaurantName, name, email, phone } = body as any;

  const [manager] = await db
    .insert(users)
    .values({
      name,
      email,
      phone,
    })
    .returning({
      id: users.id,
    });

  await db.insert(restaurants).values({
    name: restaurantName,
    managerId: manager?.id,
  });

  set.status = 204;
});

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
