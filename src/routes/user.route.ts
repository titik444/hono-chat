import { Hono } from 'hono'
import { getUser, listUser, updateUser } from '../controller/user.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { uploadMiddleware } from '../middleware/upload.middleware'

export const UserRouter = new Hono()

UserRouter.get('/user', listUser)
UserRouter.get('/user/profile/:username', getUser)
UserRouter.patch(
  '/user/profile',
  authMiddleware,
  uploadMiddleware({ uploadDir: 'user', fileFieldName: 'profile_picture' }),
  updateUser
)
