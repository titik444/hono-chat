import { prisma } from '../utils/prisma'
import { HTTPException } from 'hono/http-exception'
import { FriendValidation } from '../validation/friend.validation'
import { FriendRequestValidation } from '../validation/friend-request.validation'
import { User } from '@prisma/client'
import { ListUserRequest, ListUserResponse, toUserResponse, UserResponse } from '../model/user.model'

export class FriendService {
  static async list(user: User, request: ListUserRequest): Promise<ListUserResponse> {
    request = FriendValidation.LIST.parse(request)

    const friends = await prisma.friend.findMany({
      where: { user_id: user.id },
      include: {
        friend: true
      },
      orderBy: { friend: { fullname: 'asc' } },
      skip: (request.page - 1) * request.perPage,
      take: request.perPage
    })

    const totalItems = await prisma.friend.count({ where: { user_id: user.id } })

    return {
      data: friends.map((friend) => toUserResponse(friend.friend)),
      pagination: {
        currentPage: request.page,
        perPage: request.perPage,
        totalPages: Math.ceil(totalItems / request.perPage),
        totalItems
      }
    }
  }

  static async sendRequest(user: User, friendId: number): Promise<UserResponse> {
    friendId = FriendRequestValidation.SEND.parse(friendId)

    if (friendId === user.id) {
      throw new HTTPException(400, { message: "You can't send request to yourself" })
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: friendId }
    })

    if (!targetUser) {
      throw new HTTPException(404, { message: 'User not found' })
    }

    const alreadyFriend = await prisma.friend.findFirst({
      where: {
        OR: [
          { user_id: user.id, friend_id: friendId },
          { user_id: friendId, friend_id: user.id }
        ]
      }
    })

    if (alreadyFriend) {
      throw new HTTPException(400, { message: 'Already friends' })
    }

    const requestExists = await prisma.friendRequest.findFirst({
      where: {
        from_id: user.id,
        to_id: friendId
      }
    })

    if (requestExists) {
      throw new HTTPException(400, { message: 'Friend request already sent' })
    }

    await prisma.friendRequest.create({
      data: {
        from_id: user.id,
        to_id: friendId
      }
    })

    return toUserResponse(targetUser)
  }

  static async listRequests(user: User, request: ListUserRequest): Promise<ListUserResponse> {
    request = FriendRequestValidation.LIST.parse(request)

    const requests = await prisma.friendRequest.findMany({
      where: { to_id: user.id },
      include: {
        from: true
      },
      skip: (request.page - 1) * request.perPage,
      take: request.perPage
    })

    const totalItems = await prisma.friendRequest.count({ where: { to_id: user.id } })

    return {
      data: requests.map((req) => toUserResponse(req.from)),
      pagination: {
        currentPage: request.page,
        perPage: request.perPage,
        totalPages: Math.ceil(totalItems / request.perPage),
        totalItems
      }
    }
  }

  static async acceptRequest(user: User, userId: number): Promise<UserResponse> {
    userId = FriendRequestValidation.ACCEPT_OR_REJECT.parse(userId)

    const request = await prisma.friendRequest.findFirst({
      where: { from_id: userId, to_id: user.id },
      include: { from: true }
    })

    if (!request || request.to_id !== user.id) {
      throw new HTTPException(404, { message: 'Friend request not found' })
    }

    await prisma.$transaction([
      prisma.friend.create({
        data: {
          user_id: request.from_id,
          friend_id: request.to_id
        }
      }),

      prisma.friend.create({
        data: {
          user_id: request.to_id,
          friend_id: request.from_id
        }
      }),

      prisma.friendRequest.delete({
        where: { id: request.id }
      })
    ])

    return toUserResponse(request.from)
  }

  static async rejectRequest(user: User, userId: number): Promise<boolean> {
    userId = FriendRequestValidation.ACCEPT_OR_REJECT.parse(userId)

    const request = await prisma.friendRequest.findFirst({
      where: { from_id: userId, to_id: user.id },
      include: { from: true }
    })

    if (!request || request.to_id !== user.id) {
      throw new HTTPException(404, { message: 'Friend request not found' })
    }

    await prisma.friendRequest.delete({
      where: { id: request.id }
    })

    return true
  }

  static async deleteFriend(user: User, friendId: number): Promise<boolean> {
    friendId = FriendValidation.DELETE.parse(friendId)

    const friend = await prisma.friend.findFirst({
      where: {
        OR: [
          { user_id: user.id, friend_id: friendId },
          { user_id: friendId, friend_id: user.id }
        ]
      }
    })

    if (!friend) {
      throw new HTTPException(404, { message: 'Friend not found' })
    }

    await prisma.$transaction([
      prisma.friend.deleteMany({
        where: { user_id: user.id, friend_id: friendId }
      }),

      prisma.friend.deleteMany({
        where: { user_id: friendId, friend_id: user.id }
      })
    ])

    return true
  }
}
