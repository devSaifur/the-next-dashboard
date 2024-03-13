import { CategoryForm } from '@/components/categories/category-form'
import { getBillboardsByStoreId } from '@/data/billboard'
import { getCategoriesById } from '@/data/category'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: { categoryId: string; storeId: string }
}) {
  const { categoryId, storeId } = params

  const category = await getCategoriesById(
    categoryId === 'new' ? null : categoryId
  ) // when creating new category the params'll be 'new', that doesn't require database call

  const billboards = await getBillboardsByStoreId(storeId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  )
}
