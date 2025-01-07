import { User } from '@prisma/client'
import { ChatResponse, CreateChatRequest, toChatResponse } from '../model/chat.model'
import { chatValidation } from '../validation/chat.validation'
import { prisma } from '../utils/prisma'
import { HTTPException } from 'hono/http-exception'

export class ChatService {
  static async create(user: User, request: CreateChatRequest): Promise<ChatResponse> {
    request = chatValidation.CREATE.parse(request)

    // Cek jika sudah ada chat private antara kedua pengguna
    const existingChat = await prisma.chat.findFirst({
      where: {
        type: 'private',
        participants: {
          every: {
            user_id: { in: [user.id, request.user_id] }
          }
        }
      }
    })

    if (existingChat) {
      throw new HTTPException(422, {
        message: 'Chat already exists'
      })
    }

    // Buat chat baru dan tambahkan peserta
    const newChat = await prisma.chat.create({
      data: {
        type: 'private',
        participants: {
          create: [{ user_id: user.id }, { user_id: request.user_id }]
        }
      },
      include: {
        participants: {
          select: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    })

    // Kirim pesan pertama
    const newMessage = await prisma.message.create({
      data: {
        chat_id: newChat.id,
        sender_id: user.id,
        text: request.message
      }
    })

    return toChatResponse(
      {
        ...newChat,
        participants: newChat.participants.map((participant) => participant.user)
      },
      newMessage
    )
  }

  static async list(user: User): Promise<ChatResponse[]> {
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            user_id: user.id
          }
        }
      },
      include: {
        participants: {
          select: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        },
        messages: true
      }
    })

    return chats.map((chat) => {
      return toChatResponse(
        {
          ...chat,
          participants: chat.participants.map((participant) => participant.user)
        },
        chat.messages[0]
      )
    })
  }
}
