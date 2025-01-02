import { User } from '@prisma/client'

export type RegisterUserRequest = {
  username: string
  email: string
  password: string
}

export type LoginUserRequest = {
  email: string
  password: string
}

export type AuthResponse = {
  id: number
  username: string
  email: string
  fullname?: string | null
  bio?: string | null
  profilePicture?: string | null
  accessToken?: string
  refreshToken?: string
}

export function toAuthResponse(user: User): AuthResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    bio: user.bio,
    profilePicture: user.profile_picture
  }
}
