import { format } from 'date-fns'

import { CategoryClient } from '@/components/categories/category-client'
import type { CategoryColumn } from '@/components/categories/columns'
import { getCategoriesByStoreId } from '@/data/category'

export default async function BillboardsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const categories = await getCategoriesByStoreId(params.storeId)

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}
