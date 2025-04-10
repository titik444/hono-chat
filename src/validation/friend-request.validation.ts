import { z, ZodType } from 'zod'

export class FriendRequestValidation {
  static readonly LIST: ZodType = z.object({
    page: z.number().min(1).positive().default(1),
    perPage: z.number().min(1).max(100).positive().default(10)
  })

  static readonly SEND: ZodType = z.number().int().positive()

  static readonly ACCEPT_OR_REJECT: ZodType = z.number().int().positive()
}
