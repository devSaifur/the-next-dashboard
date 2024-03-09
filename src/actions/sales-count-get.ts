import { db } from '@/db'
import { orders } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export async function getSalesCountAction(storeId: string) {
  const sales = await db.query.orders.findMany({
    where: and(eq(orders.storeId, storeId), eq(orders.isPaid, true)),
  })

  return sales.length
}
