import { format } from 'date-fns'

import { SizeClient } from '@/components/sizes/size-client'
import type { SizeColumn } from '@/components/sizes/size-columns'
import { getSizesByStoreId } from '@/data/size'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

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
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  )
}
