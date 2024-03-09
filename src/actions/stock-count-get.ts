import { db } from '@/db'
import { products } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export async function getStockCountAction(storeId: string) {
  const stock = await db.query.products.findMany({
    where: and(eq(products.storeId, storeId), eq(products.isArchived, false)),
  })

  return stock.length
}
