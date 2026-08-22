import { Elysia } from 'elysia';

import { env } from '../env';
import { registerRestaurant } from './routes/register-restaurant';
import { sendAuthLink } from './routes/send-auth-link';
import { authenticateFromLink } from './routes/authenticate-from-link';
import { signOut } from './routes/sign-out';
import { getProfile } from './routes/get-profile';
import { getManagedRestaurant } from './routes/get-managed-restaurant';
import { getOrderDetails } from './routes/get-order-details';
import { approveOrder } from './routes/approve-order';
import { cancelOrder } from './routes/cancel-order';
import { deliverOrder } from './routes/deliver-order';
import { dispatchOrder } from './routes/dispatch-order';

const app = new Elysia()
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        const message = JSON.parse(error.message).summary;
        set.status = 400;
        return {
          status: 400,
          message,
        };
      }
      case 'UNKNOWN': {
        console.log(error);
        set.status = 500;
        return {
          status: 500,
          message: 'Internal server error',
        };
      }
    }
  })
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(cancelOrder)
  .use(deliverOrder)
  .use(dispatchOrder);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
