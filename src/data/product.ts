import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { products } from '@/db/schema'

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
