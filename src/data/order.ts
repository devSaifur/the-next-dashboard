import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { TOrderInsertSchema, orderItems, orders, products } from '@/db/schema'
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

export async function initiateOrder(value: {
  storeId: string
  productIds: string[]
}) {
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

export async function createOrder(value: {
  orderId: string
  addressString: string
  phone: string | null
}) {
  const { orderId, addressString, phone } = value

  const order = await db
    .update(orders)
    .set({
      phone,
      isPaid: true,
      address: addressString,
    })
    .where(eq(orders.id, orderId))
    .returning()

  const orderItemsRes = await db.query.orderItems.findMany({
    where: eq(orderItems.orderId, order[0].id),
  })

  const productIds = orderItemsRes.map((orderItem) => orderItem.productId)

  productIds.forEach(async (productId) => {
    await db
      .update(products)
      .set({ isArchived: true })
      .where(eq(products.id, productId))
  })
}