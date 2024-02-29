import { BillboardForm } from '@/components/billboards/billboard-form'
import { getBillboardById } from '@/data/billboard'

export default async function BillboardPage({
  params,
}: {
  params: { billboardId: string }
}) {
  const { billboardId } = params

  const billboard = await getBillboardById(
    billboardId === 'new' ? null : billboardId
  ) // when creating new billboard the params'll be 'new', that doesn't require database call

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  )
}
