import { ColorForm } from '@/components/colors/color-form'
import { getColorById } from '@/data/color'

export default async function ColorPage({
  params,
}: {
  params: { colorId: string }
}) {
  const { colorId } = params

  const color = await getColorById(colorId === 'new' ? null : colorId) // when creating new color the params'll be 'new', wil skip database call on this

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}
