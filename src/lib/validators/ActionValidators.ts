import * as z from 'zod'

export const DeleteStoreValidator = z
  .string()
  .min(1, { message: 'Store not found' })

export type TDeleteStoreValidator = z.infer<typeof DeleteStoreValidator>
