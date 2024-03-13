import 'server-only'
import { desc, eq, inArray } from 'drizzle-orm'

import { db } from '@/db'
import { products, images, TImageSelectSchema } from '@/db/schema'
import { TProductSchema } from '@/lib/validators/FormValidators'

export async function getFilteredProducts(filter: any) {
  return await db.query.products.findMany({
    where: filter,
    columns: {
      id: true,
      name: true,
      price: true,
    },
    with: {
      images: {
        columns: {
          id: true,
          url: true,
        },
      },
      category: {
        columns: {
          id: true,
          name: true,
        },
      },
      color: {
        columns: {
          id: true,
          name: true,
          value: true,
        },
      },
      size: {
        columns: {
          id: true,
          name: true,
          value: true,
        },
      },
    },
  })
}

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
        category: {
          columns: {
            id: true,
            name: true,
          },
        },
        color: {
          columns: {
            id: true,
            name: true,
            value: true,
          },
        },
        size: {
          columns: {
            id: true,
            name: true,
            value: true,
          },
        },
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

    const [product] = productArr

    const productId = product.id

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
  const productArr = await db
    .delete(products)
    .where(eq(products.id, productId))
    .returning()

  const [product] = productArr
  return product
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

    const [product] = productArr

    let imageResArr: TImageSelectSchema[] = []

    value.images.forEach(async (img) => {
      const imageArr = await tx
        .insert(images)
        .values({
          updatedAt: new Date(),
          url: img.url,
          productId,
        })
        .returning()

      const [image] = imageArr

      imageResArr.push(image)
    })

    return {
      images: imageResArr,
      ...product,
    }
  })
}

export async function getProductsByIds(ids: string[]) {
  return db.query.products.findMany({
    where: inArray(products.id, [...ids]),
  })
}
