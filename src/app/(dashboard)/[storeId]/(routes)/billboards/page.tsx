import { format } from 'date-fns'

import { BillboardClient } from '@/components/billboards/billboard-client'
import type { BillboardColumn } from '@/components/billboards/columns'
import { getBillboardByStoreId } from '@/data/billboard'

export default async function BillboardsPage({
  params,
}: {
  params: { storeId: string }
}) {
  const billboards = await getBillboardByStoreId(params.storeId)

  const formattedBillboard: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboard} />
      </div>
    </div>
  )
}
