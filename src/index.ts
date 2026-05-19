import { Hono } from 'hono'
import { parrotHandler } from './parrot/parrotHandler'

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

app.get('/parrot', parrotHandler)

export default app
