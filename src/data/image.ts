import { db } from '@/db'
import { TImageInsertSchema, images } from '@/db/schema'

export async function createImage(
  insertedImage: TImageInsertSchema[],
  productId: string
) {
  let imageArr: TImageInsertSchema[] = []

  for (const image of insertedImage) {
    const res = await db
      .insert(images)
      .values({
        productId: productId,
        updatedAt: new Date(),
        url: image.url,
      })
      .returning()
    const imageRes = res[0]

    imageArr.push(imageRes)
  }

  return imageArr
}
