import { Hono } from 'hono'
import { getCurrentUser, getUser, listUser, updateUser } from '../controller/user.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { uploadMiddleware } from '../middleware/upload.middleware'

export const UserRouter = new Hono()

UserRouter.get('/user/me', authMiddleware, getCurrentUser)
UserRouter.get('/user', listUser)
UserRouter.get('/user/:username', getUser)
UserRouter.patch(
  '/user/profile',
  authMiddleware,
  uploadMiddleware({ uploadDir: 'user', fileFieldName: 'profilePicture' }),
  updateUser
)
