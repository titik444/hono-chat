import { Context } from 'hono'
import { AuthService } from '../service/auth.service'
import { response } from '../utils/response'
import { LoginUserRequest, RegisterUserRequest, toAuthResponse } from '../model/auth.model'
import { User } from '@prisma/client'

export const registerUser = async (c: Context) => {
  const request = (await c.req.json()) as RegisterUserRequest

  const registerResponse = await AuthService.register(request)

  return response(c, 201, 'Register user success', registerResponse)
}

export const loginUser = async (c: Context) => {
  const request = (await c.req.json()) as LoginUserRequest

  const loginResponse = await AuthService.login(request)

  return response(c, 200, 'Login user success', loginResponse)
}

export const validateToken = async (c: Context) => {
  const user = c.get('user') as User

  return response(c, 200, 'Validate token success', toAuthResponse(user))
}

export const refreshToken = async (c: Context) => {
  const refreshToken = (await c.req.json()).refresh_token as string

  const loginResponse = await AuthService.refreshToken(refreshToken)

  return response(c, 200, 'Refresh token success', loginResponse)
}
