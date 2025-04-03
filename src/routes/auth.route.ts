import { Hono } from 'hono'
import { loginUser, refreshToken, registerUser } from '../controller/auth.controller'

export const AuthRouter = new Hono()

AuthRouter.post('/auth/register', registerUser)
AuthRouter.post('/auth/login', loginUser)
AuthRouter.post('/auth/refresh-token', refreshToken)
