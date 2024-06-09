import { format } from 'date-fns'

import { ColorClient } from '@/components/colors/color-client'
import type { ColorColumn } from '@/components/colors/color-columns'
import { getColorsByStoreId } from '@/data/color'
import { Suspense } from 'react'
import SkeletonMod from '@/components/skeleton-mod'

export default async function ColorsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const { storeId } = params

  const colors = await getColorsByStoreId(storeId)

  const formattedColors: ColorColumn[] = colors.map((item) => ({
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
              tile="Colors"
              description="Manage colors for your store"
            />
          }
        >
          <ColorClient data={formattedColors} />
        </Suspense>
      </div>
    </div>
  )
}
