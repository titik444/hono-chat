import { HTTPException } from 'hono/http-exception'
import { AuthResponse, LoginUserRequest, RegisterUserRequest, toAuthResponse } from '../model/auth.model'
import { prisma } from '../utils/prisma'
import { AuthValidation } from '../validation/auth.validation'
import { signJWT, verifyJWT } from '../utils/jwt'
import { User } from '@prisma/client'

const ACCESS_TOKEN_EXPIRATION = 60 * 60 * 24 // 1 day
const REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 7 // 7 days

export class AuthService {
  static async register(request: RegisterUserRequest): Promise<AuthResponse> {
    request = AuthValidation.REGISTER.parse(request)

    await this.ensureUniqueUser(request)

    request.password = await Bun.password.hash(request.password, {
      algorithm: 'bcrypt',
      cost: 10
    })

    const user = await prisma.user.create({
      data: {
        ...request
      }
    })

    return this.generateAuthResponse(user)
  }

  static async login(request: LoginUserRequest): Promise<AuthResponse> {
    request = AuthValidation.LOGIN.parse(request)

    const user = await prisma.user.findUnique({
      where: { email: request.email }
    })

    if (!user || !(await Bun.password.verify(request.password, user.password, 'bcrypt'))) {
      throw new HTTPException(401, { message: 'Username or password is wrong' })
    }

    return this.generateAuthResponse(user)
  }

  static async validateToken(token: string | null | undefined): Promise<User> {
    const { data: parsedToken, error } = AuthValidation.TOKEN.safeParse(token)

    if (error || !parsedToken) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const { decoded } = await verifyJWT(parsedToken)

    if (!decoded || decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new HTTPException(403, { message: 'Token expired or invalid' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    return user
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data: parsedToken, error } = AuthValidation.TOKEN.safeParse(refreshToken)

    if (error || !parsedToken) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const { decoded } = await verifyJWT(parsedToken)

    if (!decoded || decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new HTTPException(403, { message: 'Token expired or invalid' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    return {
      ...toAuthResponse(user),
      accessToken: await signJWT(
        { id: user.id, username: user.username },
        { exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRATION }
      ),
      refreshToken: refreshToken
    }
  }

  static async ensureUniqueUser(request: RegisterUserRequest): Promise<void> {
    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ username: request.username }, { email: request.email }]
      }
    })

    if (exists) {
      const field = exists.username === request.username ? 'Username' : 'Email'
      throw new HTTPException(400, { message: `${field} already exists` })
    }
  }

  private static async generateAuthResponse(user: User): Promise<AuthResponse> {
    const accessToken = await signJWT(
      { id: user.id, username: user.username },
      { exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRATION }
    )
    const refreshToken = await signJWT(
      { id: user.id, username: user.username },
      { exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRATION }
    )

    return {
      ...toAuthResponse(user),
      accessToken,
      refreshToken
    }
  }
}
