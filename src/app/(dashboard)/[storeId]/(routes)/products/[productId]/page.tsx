import { ProductForm } from '@/components/products/product-form'
import { getCategoriesByStoreId } from '@/data/category'
import { getColorsByStoreId } from '@/data/color'
import { getProductById } from '@/data/product'
import { getSizesByStoreId } from '@/data/size'

export default async function ProductsPage({
  params,
}: {
  params: { productId: string; storeId: string }
}) {
  const { productId, storeId } = params

  const product = await getProductById(productId === 'new' ? null : productId) // when creating new product the params'll be 'new', that doesn't require database call
  const categories = await getCategoriesByStoreId(storeId)
  const sizes = await getSizesByStoreId(storeId)
  const colors = await getColorsByStoreId(storeId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-8">
        <ProductForm
          categories={categories}
          sizes={sizes}
          colors={colors}
          initialData={product}
        />
      </div>
    </div>
  )
}
