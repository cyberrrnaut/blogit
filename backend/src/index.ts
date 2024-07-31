import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'

type Bindings = {
    DATABASE_URL:string,
    JWT_SECRET:string
}


const app = new Hono<{ Bindings: Bindings }>()

const JWT_SECRET="3725"

app.post('/api/v1/signup', async(c) => {
	const { DATABASE_URL } = c.env;

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL, 
      },
    },
  }).$extends(withAccelerate());

  const body = await c.req.json();

   const user=  await prisma.user.create({
    data:{
      email:body.email,
      password: body.password
    }
   })

  


    
    const token = await sign({id:user.id}, c.env.JWT_SECRET)


  return c.json({
    bearer: token
  })
})

app.post('/api/v1/signin', (c) => {
	return c.text('signin route')
})

app.get('/api/v1/blog/:id', (c) => {
	const id = c.req.param('id')
	console.log(id);
	return c.text('get blog route')
})

app.post('/api/v1/blog', (c) => {

	return c.text('signin route')
})

app.put('/api/v1/blog', (c) => {
	return c.text('signin route')
})




export default app




