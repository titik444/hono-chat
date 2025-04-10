import { Hono } from 'hono'

import { authMiddleware } from '../middleware/auth.middleware'
import {
  acceptFriendRequest,
  addFriend,
  deleteFriend,
  listFriend,
  listFriendRequest,
  rejectFriendRequest
} from '../controller/friend.controller'

export const FriendRouter = new Hono()

FriendRouter.get('/friend', authMiddleware, listFriend)
FriendRouter.post('/friend', authMiddleware, addFriend)

FriendRouter.get('/friend-request', authMiddleware, listFriendRequest)
FriendRouter.post('/friend-request/:userId/accept', authMiddleware, acceptFriendRequest)
FriendRouter.delete('/friend-request/:userId/reject', authMiddleware, rejectFriendRequest)
FriendRouter.delete('/friend/:userId', authMiddleware, deleteFriend)
