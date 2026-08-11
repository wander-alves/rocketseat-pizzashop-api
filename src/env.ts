import { z } from 'zod';

const envSchema = z.object({
  API_BASE_URL: z.url().startsWith('http://'),
  AUTH_REDIRECT_URL: z.url().startsWith('http://'),
  DATABASE_URL: z.url().startsWith('postgres://'),
  PORT: z.coerce.number().default(3333),
});

const env = envSchema.parse(process.env);

export { env };
