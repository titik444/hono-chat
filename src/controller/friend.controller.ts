import { Context } from 'hono'
import { ListUserRequest } from '../model/user.model'
import { response } from '../utils/response'
import { User } from '@prisma/client'
import { FriendService } from '../service/friend.service'

export const listFriend = async (c: Context) => {
  const user = c.get('user') as User

  const request: ListUserRequest = {
    keyword: c.req.query('q')?.toString() || '',
    page: Number(c.req.query('page')) || 1,
    perPage: Number(c.req.query('perPage')) || 10
  }

  const listFriendResponse = await FriendService.list(user, request)

  return response(c, 200, 'List friend success', listFriendResponse)
}

export const addFriend = async (c: Context) => {
  const user = c.get('user') as User

  const { userId: friendId } = await c.req.json()

  const addFriendResponse = await FriendService.sendRequest(user, friendId)

  return response(c, 200, 'Add friend success', addFriendResponse)
}

export const listFriendRequest = async (c: Context) => {
  const user = c.get('user') as User

  const request: ListUserRequest = {
    keyword: c.req.query('q')?.toString() || '',
    page: Number(c.req.query('page')) || 1,
    perPage: Number(c.req.query('perPage')) || 10
  }

  const listFriendRequestResponse = await FriendService.listRequests(user, request)

  return response(c, 200, 'List friend request success', listFriendRequestResponse)
}

export const acceptFriendRequest = async (c: Context) => {
  const user = c.get('user') as User

  const userId = Number(c.req.param('userId'))

  const acceptFriendRequestResponse = await FriendService.acceptRequest(user, userId)

  return response(c, 200, 'Accept friend request success', acceptFriendRequestResponse)
}

export const rejectFriendRequest = async (c: Context) => {
  const user = c.get('user') as User

  const userId = Number(c.req.param('userId'))

  const rejectFriendRequestResponse = await FriendService.rejectRequest(user, userId)

  return response(c, 200, 'Reject friend request success', rejectFriendRequestResponse)
}

export const deleteFriend = async (c: Context) => {
  const user = c.get('user') as User

  const friendId = Number(c.req.param('userId'))

  const deleteFriendResponse = await FriendService.deleteFriend(user, friendId)

  return response(c, 200, 'Delete friend success', deleteFriendResponse)
}
