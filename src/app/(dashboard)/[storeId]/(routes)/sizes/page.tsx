import { format } from 'date-fns'

import { SizeClient } from '@/components/sizes/size-client'
import type { SizeColumn } from '@/components/sizes/size-columns'
import { getSizesByStoreId } from '@/data/size'
import { Suspense } from 'react'
import SkeletonMod from '@/components/skeleton-mod'

export default async function SizesPage({
  params,
}: {
  params: { storeId: string }
}) {
  const { storeId } = params

  const sizes = await getSizesByStoreId(storeId)

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense
          fallback={
            <SkeletonMod
              tile="Sizes"
              description="Manage Sizes for your store"
            />
          }
        >
          <SizeClient data={formattedSizes} />
        </Suspense>
      </div>
    </div>
  )
}
