import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { products, images, TImageSelectSchema } from '@/db/schema'
import { TProductSchema } from '@/lib/validators/FormValidators'
import { getFirstObject } from '@/utils/helpers'

export async function getProductsByStoreId(storeId: string) {
  return await db.query.products.findMany({
    where: eq(products.storeId, storeId),
    with: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: [desc(products.createdAt)],
  })
}

export async function getProductById(id: string | null) {
  if (id) {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        images: true,
      },
    })
  }
}

export async function createProduct(
  value: TProductSchema & { storeId: string }
) {
  const {
    name,
    price,
    categoryId,
    colorId,
    isArchived,
    isFeatured,
    sizeId,
    storeId,
  } = value

  return await db.transaction(async (tx) => {
    const productArr = await tx
      .insert(products)
      .values({
        price: price.toString(),
        updatedAt: new Date(),
        name,
        categoryId,
        colorId,
        sizeId,
        storeId,
        isArchived,
        isFeatured,
      })
      .returning()

    const product = getFirstObject(productArr)

    const productId = product?.id as string

    let imageResArr: TImageSelectSchema[] = []

    value.images.forEach(async (image) => {
      const imageRes = await tx
        .insert(images)
        .values({
          productId,
          updatedAt: new Date(),
          url: image.url,
        })
        .returning()

      imageRes.push(imageRes[0])
    })

    return {
      images: imageResArr,
      ...product,
    }
  })
}

export async function deleteProductById(productId: string) {
  const product = await db
    .delete(products)
    .where(eq(products.id, productId))
    .returning()
  return getFirstObject(product)
}

export async function updateProduct(
  value: TProductSchema & { productId: string }
) {
  const {
    name,
    price,
    categoryId,
    colorId,
    isArchived,
    isFeatured,
    sizeId,
    productId,
  } = value

  return await db.transaction(async (tx) => {
    await tx.delete(images).where(eq(images.productId, productId))

    const productArr = await tx
      .update(products)
      .set({
        price: price.toString(),
        updatedAt: new Date(),
        name,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
      })
      .where(eq(products.id, productId))
      .returning()

    const product = getFirstObject(productArr)

    let imageResArr: TImageSelectSchema[] = []

    value.images.forEach(async (image) => {
      const imageRes = await tx
        .insert(images)
        .values({
          updatedAt: new Date(),
          url: image.url,
          productId,
        })
        .returning()

      imageResArr.push(imageRes[0])
    })

    return {
      images: imageResArr,
      ...product,
    }
  })
}
