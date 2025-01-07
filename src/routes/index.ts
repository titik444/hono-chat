import { Hono } from 'hono'
import { prisma } from '../utils/prisma'
import { AuthRouter } from './auth.route'
import { UserRouter } from './user.route'
import { ChatRouter } from './chat.route'

export const routes = (app: Hono) => {
  app.get('/health', async (c) => {
    try {
      await prisma.$connect()
      return c.json({
        status: true,
        statusCode: 200,
        message: 'OK'
      })
    } catch (err) {
      throw new Error(err as string)
    }
  })

  const Router = new Hono()

  Router.route('/', AuthRouter)
  Router.route('/', UserRouter)
  Router.route('/', ChatRouter)

  app.route('/api', Router)
}
