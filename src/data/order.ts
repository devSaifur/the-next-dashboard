import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { orders } from '@/db/schema'

export async function getOrderByStoreId(storeId: string) {
  return db.query.orders.findMany({
    where: eq(orders.storeId, storeId),
    with: {
      orderItems: {
        with: {
          product: true,
        },
      },
    },
    orderBy: [desc(orders.createdAt)],
  })
}
