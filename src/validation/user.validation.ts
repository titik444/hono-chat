import { z, ZodType } from 'zod'

export class UserValidation {
  static readonly LIST: ZodType = z.object({
    page: z.number().min(1).positive(),
    per_page: z.number().min(1).max(100).positive()
  })

  static readonly GET: ZodType = z.string().min(3).max(100)

  static readonly UPDATE: ZodType = z.object({
    username: z.string().min(3).max(100).optional(),
    old_password: z.string().min(8).max(100).optional(),
    new_password: z.string().min(8).max(100).optional(),
    fullname: z.string().min(3).max(100).optional(),
    profile_picture: z.string().min(3).max(255).optional(),
    bio: z.string().min(3).max(255).optional()
  })
}
