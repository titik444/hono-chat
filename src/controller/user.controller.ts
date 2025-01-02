import { Context } from 'hono'
import { ListUserRequest, UpdateUserRequest } from '../model/user.model'
import { UserService } from '../service/user.service'
import { response } from '../utils/response'
import { User } from '@prisma/client'

export const listUser = async (c: Context) => {
  const request: ListUserRequest = {
    page: Number(c.req.query('page')) || 1,
    per_page: Number(c.req.query('per_page')) || 10
  }

  const listUserResponse = await UserService.list(request)

  return response(c, 200, 'List user success', listUserResponse)
}

export const getUser = async (c: Context) => {
  const username = c.req.param('username')

  const userResponse = await UserService.get(username)

  return response(c, 200, 'Get user success', userResponse)
}

export const updateUser = async (c: Context) => {
  const user = c.get('user') as User

  const formData = await c.req.formData()

  const request: UpdateUserRequest = {
    username: formData.get('username')?.toString() || undefined,
    old_password: formData.get('old_password')?.toString() || undefined,
    new_password: formData.get('new_password')?.toString() || undefined,
    fullname: formData.get('fullname')?.toString() || undefined,
    profile_picture: c.get('uploadedFilePath') as unknown as string,
    bio: formData.get('bio')?.toString() || undefined
  }

  const userResponse = await UserService.update(user, request)

  return response(c, 200, 'Update user success', userResponse)
}
