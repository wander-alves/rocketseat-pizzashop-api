import { Elysia } from 'elysia';
import { auth } from '../auth';

const signOut = new Elysia()
  .use(auth)
  .post('/sign-out', async ({ signOutUser }) => {
    signOutUser();
  });

export { signOut };
