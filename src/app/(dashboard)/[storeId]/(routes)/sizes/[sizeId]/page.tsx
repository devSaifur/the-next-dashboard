import { SizeForm } from '@/components/sizes/size-form'
import { getSizeById } from '@/data/size'

export default async function SizePage({
  params,
}: {
  params: { sizeId: string }
}) {
  const { sizeId } = params

  const size = await getSizeById(sizeId === 'new' ? null : sizeId) // when creating new size the params'll be 'new', wil skip database call on this

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <SizeForm initialData={size} />
      </div>
    </div>
  )
}
