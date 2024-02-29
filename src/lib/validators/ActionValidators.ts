import * as z from 'zod'

export const StoreSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export type TStoreSchema = z.infer<typeof StoreSchema>

export const BillboardSchema = z.object({
  label: z.string().min(1, { message: 'Label is required' }),
  imageUrl: z.string().min(1, { message: 'Image is required' }),
})

export type TBillboardSchema = z.infer<typeof BillboardSchema>

export const CategorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  billboardId: z.string().min(1, { message: 'Billboard is required' }),
})

export type TCategorySchema = z.infer<typeof CategorySchema>
