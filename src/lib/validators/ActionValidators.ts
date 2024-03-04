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

export const SizeSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  value: z.string().min(1, { message: 'Value is required' }),
})

export type TSizeSchema = z.infer<typeof SizeSchema>

export const ColorSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  value: z.string().min(1, { message: 'Value is required' }).regex(/^#/, {
    message: 'Must be a valid color',
  }),
})
export type TColorSchema = z.infer<typeof ColorSchema>

export const ProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.coerce.number().min(1, { message: 'Price is required' }),
  isFeatured: z.boolean().nullable(),
  isArchived: z.boolean().nullable(),
  images: z
    .object({
      url: z.string().min(1, { message: 'Image is required' }),
    })
    .array(),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
})

export type TProductSchema = z.infer<typeof ProductSchema>
