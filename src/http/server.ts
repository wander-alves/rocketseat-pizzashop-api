import { Elysia } from 'elysia';

import { env } from '../env';
import { registerRestaurant } from './routes/register-restaurant';
import { sendAuthLink } from './routes/send-auth-link';
import { authenticateFromLink } from './routes/authenticate-from-link';
import { signOut } from './routes/sign-out';
import { getProfile } from './routes/get-profile';

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
