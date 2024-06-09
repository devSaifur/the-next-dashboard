import { format } from 'date-fns'

import { ProductClient } from '@/components/products/product-client'
import type { ProductColumn } from '@/components/products/product-columns'
import { getProductsByStoreId } from '@/data/product'
import { formatter } from '@/utils/helpers'
import { Suspense } from 'react'
import SkeletonMod from '@/components/skeleton-mod'

export default async function ProductsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const { storeId } = params

  const billboards = await getProductsByStoreId(storeId)

  const formattedProducts: ProductColumn[] = billboards.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(Number(item.price)),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense
          fallback={
            <SkeletonMod
              tile="Products"
              description="Manage products for your store"
            />
          }
        >
          <ProductClient data={formattedProducts} />
        </Suspense>
      </div>
    </div>
  )
}
