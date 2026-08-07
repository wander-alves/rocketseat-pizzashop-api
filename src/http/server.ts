import { Elysia } from 'elysia';

const app = new Elysia()
  .get("/", ()=> {
    return "hello world.\n"
  });

app.listen(3333, ()=> { 
  console.log(`Server running on 3333...`)
})