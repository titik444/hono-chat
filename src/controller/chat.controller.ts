import { User } from '@prisma/client'
import { CreateChatRequest } from '../model/chat.model'
import { ChatService } from '../service/chat.service'
import { Context } from 'hono'
import { response } from '../utils/response'

export const createChat = async (c: Context) => {
  const user = c.get('user') as User

  const request = (await c.req.json()) as CreateChatRequest

  const chatResponse = await ChatService.create(user, request)

  return response(c, 201, 'Create chat success', chatResponse)
}

export const listChat = async (c: Context) => {
  const user = c.get('user') as User

  const chatResponse = await ChatService.list(user)

  return response(c, 200, 'List chat success', chatResponse)
}
