import { User } from '@prisma/client'
import { ListUserRequest, ListUserResponse, toUserResponse, UpdateUserRequest, UserResponse } from '../model/user.model'
import { prisma, QueryMode } from '../utils/prisma'
import { UserValidation } from '../validation/user.validation'
import { HTTPException } from 'hono/http-exception'

export class UserService {
  static async list(request: ListUserRequest): Promise<ListUserResponse> {
    request = UserValidation.LIST.parse(request)

    const filter = request.keyword
      ? {
          OR: [
            { username: { contains: request.keyword, mode: QueryMode.insensitive } },
            { fullname: { contains: request.keyword, mode: QueryMode.insensitive } }
          ]
        }
      : {}

    const users = await prisma.user.findMany({
      where: filter,
      skip: (request.page - 1) * request.perPage,
      take: request.perPage
    })

    const totalItems = await prisma.user.count({ where: filter })

    return {
      data: users.map(toUserResponse),
      pagination: {
        currentPage: request.page,
        perPage: request.perPage,
        totalPages: Math.ceil(totalItems / request.perPage),
        totalItems
      }
    }
  }

  static async get(username: string): Promise<UserResponse> {
    username = UserValidation.GET.parse(username)

    const user = await this.userMustExists(username)

    return toUserResponse(user)
  }

  static async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    request = UserValidation.UPDATE.parse(request)

    // validate username
    if (request.username) {
      await this.ensureUniqueUsername(request.username)
    }

    // validate old password
    if (request.oldPassword) {
      if (!request.newPassword) {
        throw new HTTPException(400, {
          message: 'New password is required'
        })
      }

      if (!(await Bun.password.verify(request.oldPassword, user.password, 'bcrypt'))) {
        throw new HTTPException(400, {
          message: 'Old password is wrong'
        })
      }

      user.password = await Bun.password.hash(request.newPassword, {
        algorithm: 'bcrypt',
        cost: 10
      })
    }

    // delete old profile picture
    if (request.profilePicture) {
      const path = './public/' + user.profile_picture
      const file = Bun.file(path)

      await file.delete()
    }

    user.username = request.username || user.username
    user.fullname = request.fullname || user.fullname
    user.bio = request.bio || user.bio
    user.profile_picture = request.profilePicture || user.profile_picture

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        ...user
      }
    })

    return toUserResponse(updatedUser)
  }

  private static async userMustExists(username: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })

    if (!user) {
      throw new HTTPException(404, {
        message: 'User not found'
      })
    }

    return user
  }

  private static async ensureUniqueUsername(username: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: {
        username,
        NOT: {
          username: username
        }
      }
    })

    if (user) {
      throw new HTTPException(400, {
        message: 'Username already exists'
      })
    }
  }
}
