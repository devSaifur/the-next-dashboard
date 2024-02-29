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

export const BillboardSchema = z.object({
  label: z.string().min(1, { message: 'Label is required' }),
  imageUrl: z.string().min(1, { message: 'Image is required' }),
})

export type TBillboardSchema = z.infer<typeof BillboardSchema>

export const BillboardDeleteSchema = z.object({
  storeId: z.string().min(1),
  billboardId: z.string().min(1),
})

export type TBillboardDeleteSchema = z.infer<typeof BillboardDeleteSchema>

export const CategorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  billboardId: z.string().min(1, { message: 'Billboard is required' }),
})

export type TCategorySchema = z.infer<typeof CategorySchema>
