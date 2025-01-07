import { z, ZodType } from 'zod'

export class chatValidation {
  static readonly CREATE: ZodType = z.object({
    user_id: z.number().positive(),
    message: z.string().min(1).max(255)
  })
}
