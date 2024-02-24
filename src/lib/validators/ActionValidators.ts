import * as z from 'zod'

export const StoreCreateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export type TStoreCreateSchema = z.infer<typeof StoreCreateSchema>

export const StoreUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  storeId: z.string().min(1),
})

export type TStoreUpdateSchema = z.infer<typeof StoreUpdateSchema>

export const StoreDeleteSchema = z
  .string()
  .min(1, { message: 'Store not found' })

export type TStoreDeleteSchema = z.infer<typeof StoreDeleteSchema>

export const BillboardCreateUpdateSchema = z.object({
  label: z.string().min(1, { message: 'Label is required' }),
  imageUrl: z.string().min(1, { message: 'Image is required' }),
  storeId: z.string().min(1),
  billboardId: z.string().min(1),
})

export type TBillboardCreateUpdateSchema = z.infer<
  typeof BillboardCreateUpdateSchema
>
