import { Chat, Message } from '@prisma/client'

export type CreateChatRequest = {
  user_id: number
  message: string
}

export type ChatResponse = {
  chat: {
    id: number
    type: string
    createdAt: Date
    participants: {
      id: number
      username: string
    }[]
  }
  message: {
    id: number
    text: string
    senderId: number
    createdAt: Date
  }
}

export function toChatResponse(
  chat: Chat & { participants: { id: number; username: string }[] },
  message: Message
): ChatResponse {
  return {
    chat: {
      id: chat.id,
      type: chat.type,
      createdAt: chat.created_at,
      participants: chat.participants.map((p) => ({ id: p.id, username: p.username }))
    },
    message: {
      id: message.id,
      text: message.text,
      senderId: message.sender_id,
      createdAt: message.created_at
    }
  }
}
