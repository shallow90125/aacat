import { Hono } from 'hono'

import { badAppleHandler } from './badApple/badAppleHandler'
import { parrotHandler } from './parrot/parrotHandler'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/parrot', parrotHandler)
app.get('/bad-apple', badAppleHandler)

export default app
