import * as z from 'zod'

export const FormValidator = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export type TFormValidator = z.infer<typeof FormValidator>

export const SettingsFormValidator = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  storeId: z.string().min(1),
})

export type TSettingsFormValidator = z.infer<typeof SettingsFormValidator>
