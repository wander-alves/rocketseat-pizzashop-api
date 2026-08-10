import { Elysia } from 'elysia';

import { env } from '../env';

const app = new Elysia().get('/', () => {
  return 'hello world.\n';
});

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
