'use server'

import { db } from '@/db'
import { orders } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export type GraphData = {
  name: string
  total: number
}

export async function getGraphRevenueAction(storeId: string) {
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

  const monthlyRevenue: { [key: number]: number } = {}

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth()
    let revenueForOrder = 0

    for (const item of order.orderItems) {
      revenueForOrder += Number(item.product.price)
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder
  }

  const graphData: GraphData[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ]

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
  }

  return graphData
}
