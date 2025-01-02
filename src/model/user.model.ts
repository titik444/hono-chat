import { User } from '@prisma/client'

export type ListUserRequest = {
  page: number
  per_page: number
}

export type UpdateUserRequest = {
  username?: string
  old_password?: string
  new_password?: string
  fullname?: string
  profile_picture?: string
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
