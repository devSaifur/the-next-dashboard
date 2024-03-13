import { format } from 'date-fns'

import { ProductClient } from '@/components/products/product-client'
import type { ProductColumn } from '@/components/products/product-columns'
import { getProductsByStoreId } from '@/data/product'
import { formatter } from '@/utils/helpers'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

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
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}
