import { getBillboardById } from '@/data/billboard'

export default async function BillboardPage({
  params,
}: {
  params: { billboardId: string }
}) {
  const { billboardId } = params

  const billboard = await getBillboardById(billboardId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">BillboardForm</div>
    </div>
  )
}
