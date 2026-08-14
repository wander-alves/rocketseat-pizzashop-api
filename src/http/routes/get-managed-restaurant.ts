import { Elysia } from 'elysia';

import { db } from '../../db/connection';
import { auth } from '../auth';

const getManagedRestaurant = new Elysia()
  .use(auth)
  .get('/managed-restaurant', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new Error('Your account does not manage a restaurant.');
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId);
      },
    });

    if (!managedRestaurant) {
      throw new Error('Restaurant not found.');
    }

    return managedRestaurant;
  });

export { getManagedRestaurant };
