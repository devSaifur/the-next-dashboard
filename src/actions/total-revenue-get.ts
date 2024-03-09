import { db } from '@/db'
import { orders } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export async function getTotalRevenueAction(storeId: string) {
  const paidOrders = await db.query.orders.findMany({
    where: and(eq(orders.storeId, storeId), eq(orders.isPaid, true)),
    with: {
      orderItems: {
        with: {
          product: true,
        },
      },
    },
  })

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item): number => {
      return orderSum + Number(item.product.price)
    }, 0)

    return total + orderTotal
  }, 0)

  return totalRevenue
}
