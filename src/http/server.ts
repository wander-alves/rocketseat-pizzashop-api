import { Elysia, t } from 'elysia';

import { env } from '../env';
import { db } from '../db/connection';
import { restaurants, users } from '../db/schema';

const app = new Elysia().post(
  '/restaurants',
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } = body;

    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
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
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      managerName: t.String(),
      email: t.String(),
      phone: t.String(),
    }),
  },
);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
