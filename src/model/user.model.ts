import { User } from '@prisma/client'

export type ListUserRequest = {
  keyword: string
  page: number
  perPage: number
}

export type UpdateUserRequest = {
  username?: string
  oldPassword?: string
  newPassword?: string
  fullname?: string
  profilePicture?: string
  bio?: string
}

export type UserResponse = {
  id: number
  username: string
  fullname: string | null
  profilePicture: string | null
  bio?: string | null
  createdAt?: Date
}

export type ListUserResponse = {
  data: UserResponse[]
  pagination: {
    currentPage: number
    perPage: number
    totalPages: number
    totalItems: number
  }
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    profilePicture: user.profile_picture
      ? `${process.env.BASE_URL}:${process.env.PORT ?? 3000}/${user.profile_picture}`
      : `https://ui-avatars.com/api/?name=${user.fullname}&background=random`,
    bio: user.bio,
    createdAt: user.created_at
  }
}
