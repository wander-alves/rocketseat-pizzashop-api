import { Elysia } from 'elysia';

import { env } from '../env';
import { registerRestaurant } from './routes/register-restaurant';
import { sendAuthLink } from './routes/send-auth-link';
import { authenticateFromLink } from './routes/authenticate-from-link';
import { signOut } from './routes/sign-out';
import { getProfile } from './routes/get-profile';
import { getManagedRestaurant } from './routes/get-managed-restaurant';

const app = new Elysia()

  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .onError({ as: 'global' }, ({ code, error, set }) => {
    console.log(code);
    switch (code) {
      case 'VALIDATION': {
        console.log(error.message);
        const message = JSON.parse(error.message).summary;
        set.status = 400;
        return {
          status: 400,
          message,
        };
      }
      // case 'UNAUTHORIZED': {
      //   return {
      //     status: error.status,
      //     message: error.message,
      //   };
      // }

      default: {
        console.log(error);
        return {
          status: 500,
          message: 'Internal server error',
        };
      }
    }
  });

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
