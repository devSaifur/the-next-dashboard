import { format } from 'date-fns'

import { BillboardClient } from '@/components/billboards/billboard-client'
import type { BillboardColumn } from '@/components/billboards/billboard-columns'
import { getBillboardsByStoreId } from '@/data/billboard'
import { Suspense } from 'react'
import SkeletonMod from '@/components/skeleton-mod'

export default async function BillboardsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const { storeId } = params

  const billboards = await getBillboardsByStoreId(storeId)

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense
          fallback={
            <SkeletonMod
              tile="Billboards"
              description="Manage billboards for your store"
            />
          }
        >
          <BillboardClient data={formattedBillboards} />
        </Suspense>
      </div>
    </div>
  )
}
