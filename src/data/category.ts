import { db } from '@/db'
import { categories } from '@/db/schema'
import { TCategoryCreateUpdateSchema } from '@/lib/validators/ActionValidators'
import { desc, eq } from 'drizzle-orm'

export async function getCategoriesByStoreId(storeId: string) {
  const data = await db.query.categories.findMany({
    where: eq(categories.storeId, storeId),
    with: {
      billboard: true,
    },
    orderBy: [desc(categories.createdAt)],
  })
  return data
}

export async function getCategoriesById(id: string) {
  try {
    const data = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    })
    if (!data) return null
    return data
  } catch (err) {
    return null
  }
}

export async function createCategory(values: TCategoryCreateUpdateSchema) {
  try {
    await db.insert(categories).values({ updatedAt: new Date(), ...values })
  } catch (err) {
    console.error(err)
  }
}

export async function updateCategory(
  values: Omit<TCategoryCreateUpdateSchema, 'storeId'>
) {
  const { name, billboardId, categoryId } = values

  try {
    await db
      .update(categories)
      .set({ name, billboardId, updatedAt: new Date() })
      .where(eq(categories.id, categoryId))
  } catch (err) {
    console.error(err)
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await db.delete(categories).where(eq(categories.id, categoryId))
  } catch (err) {
    console.error(err)
  }
}
