import { Hono } from 'hono'
import { loginUser, refreshToken, registerUser, validateToken } from '../controller/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const AuthRouter = new Hono()

AuthRouter.post('/auth/register', registerUser)
AuthRouter.post('/auth/login', loginUser)
AuthRouter.get('/auth/validate-token', authMiddleware, validateToken)
AuthRouter.post('/auth/refresh-token', refreshToken)
