import { User } from '@prisma/client'
import { ListUserRequest, ListUserResponse, toUserResponse, UpdateUserRequest, UserResponse } from '../model/user.model'
import { prisma } from '../utils/prisma'
import { UserValidation } from '../validation/user.validation'
import { HTTPException } from 'hono/http-exception'
import { AuthService } from './auth.service'

export class UserService {
  static async list(request: ListUserRequest): Promise<ListUserResponse> {
    request = UserValidation.LIST.parse(request)

    const users = await prisma.user.findMany({
      skip: (request.page - 1) * request.per_page,
      take: request.per_page
    })

    const totalItems = await prisma.user.count()

    return {
      data: users.map(toUserResponse),
      pagination: {
        currentPage: request.page,
        perPage: request.per_page,
        totalPages: Math.ceil(totalItems / request.per_page),
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

    await this.userMustExists(user.username)

    // validate old password
    if (request.old_password) {
      if (!request.new_password) {
        throw new HTTPException(400, {
          message: 'New password is required'
        })
      }

      if (!(await Bun.password.verify(request.old_password, user.password, 'bcrypt'))) {
        throw new HTTPException(400, {
          message: 'Old password is wrong'
        })
      }

      user.password = await Bun.password.hash(request.new_password, {
        algorithm: 'bcrypt',
        cost: 10
      })
    }

    user.fullname = request.fullname || user.fullname
    user.bio = request.bio || user.bio
    user.profile_picture = request.profile_picture || user.profile_picture

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
