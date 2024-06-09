import { format } from 'date-fns'

import { CategoryClient } from '@/components/categories/category-client'
import type { CategoryColumn } from '@/components/categories/category-columns'
import { getCategoriesByStoreId } from '@/data/category'
import { Suspense } from 'react'
import SkeletonMod from '@/components/skeleton-mod'

export default async function CategoriesPage({
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
        <Suspense
          fallback={
            <SkeletonMod
              tile="Categories"
              description="Manage categories for your store"
            />
          }
        >
          <CategoryClient data={formattedCategories} />
        </Suspense>
      </div>
    </div>
  )
}
