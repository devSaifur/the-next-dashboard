import { format } from 'date-fns'

import { OrderClient } from '@/components/orders/order-client'
import { getOrderByStoreId } from '@/data/order'
import { formatter } from '@/utils/helpers'
import { OrderColumn } from '@/components/orders/order-columns'
import { Suspense } from 'react'
import SkeletonMod from '@/components/skeleton-mod'

export default async function OrdersPage({
  params,
}: {
  params: { storeId: string }
}) {
  const { storeId } = params

  const orders = await getOrderByStoreId(storeId)

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    products: item.orderItems
      .map((orderItem) => orderItem.product?.name)
      .join(', '),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product?.price)
      }, 0)
    ),
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense
          fallback={
            <SkeletonMod
              tile="Orders"
              description="Manage orders for your store"
            />
          }
        >
          <OrderClient data={formattedOrders} />
        </Suspense>
      </div>
    </div>
  )
}
