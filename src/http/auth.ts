/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Elysia, t, type Static } from 'elysia';
import jwt from '@elysiajs/jwt';

import { env } from '../env';
import { UnauthorizedError } from './errors/unauthorized-error';

const jwtSchema = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
});

const auth = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
  })
  .onError({ as: 'scoped' }, ({ code, error, set }) => {
    console.log('auth');
    switch (code) {
      case 'UNAUTHORIZED': {
        set.status = 400;
        return {
          status: error.status,
          message: error.message,
        };
      }
    }
  })
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtSchema,
    }),
  )
  .derive({ as: 'scoped' }, ({ jwt, cookie: { auth } }) => {
    return {
      signInUser: async (payload: Static<typeof jwtSchema>) => {
        const token = await jwt.sign(payload);

        auth!.value = token;
        auth!.httpOnly = true;
        auth!.maxAge = 60 * 60 * 24 * 7;
        auth!.path = '/';
      },
      signOutUser: () => {
        auth?.remove();
      },
      getCurrentUser: async () => {
        if (!auth || !auth.value) {
          throw new UnauthorizedError();
        }
        console.log('teste');

        const payload = await jwt.verify(String(auth.value));

        if (!payload) {
          throw new UnauthorizedError();
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        };
      },
    };
  });

export { auth, jwtSchema };
