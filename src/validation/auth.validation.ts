import { z, ZodType } from 'zod'

export class AuthValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100)
  })

  static readonly LOGIN: ZodType = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100)
  })

  static readonly TOKEN: ZodType = z.string().min(1)
}
