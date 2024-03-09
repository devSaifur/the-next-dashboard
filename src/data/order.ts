import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { TOrderInsertSchema, orderItems, orders } from '@/db/schema'
import { getFirstObject } from '@/utils/helpers'

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

type OrderInsert = {
  storeId: string
  productIds: string[]
}

export async function createOrder(value: OrderInsert) {
  const { storeId, productIds } = value

  return await db.transaction(async (tx) => {
    const orderArr = await tx
      .insert(orders)
      .values({ storeId, isPaid: false, updatedAt: new Date() })
      .returning()

    productIds.forEach(async (id) => {
      await tx
        .insert(orderItems)
        .values({ productId: id, orderId: orderArr[0].id })
    })

    return getFirstObject(orderArr)
  })
}
