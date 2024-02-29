import { CategoryForm } from '@/components/categories/category-form'
import { getBillboardByStoreId } from '@/data/billboard'
import { getCategoriesById } from '@/data/category'

export default async function CategoriesPage({
  params,
}: {
  params: { categoryId: string; storeId: string }
}) {
  const { categoryId, storeId } = params

  const category = await getCategoriesById(
    categoryId === 'new' ? null : categoryId
  ) // when creating new category the params'll be 'new', that doesn't require database call

  const billboards = await getBillboardByStoreId(storeId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  )
}
