import { Hono } from 'hono'
import { createChat, listChat } from '../controller/chat.controller'
import { ApplicationVariables } from '../model/app.model'
import { authMiddleware } from '../middleware/auth.middleware'

export const ChatRouter = new Hono<{ Variables: ApplicationVariables }>()

ChatRouter.post('/chat', authMiddleware, createChat)
ChatRouter.get('/chat', authMiddleware, listChat)
