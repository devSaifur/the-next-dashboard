import { db } from '@/db'
import { categories } from '@/db/schema'
import { TCategorySchema } from '@/lib/validators/ActionValidators'
import { getFirstObject } from '@/utils/helpers'
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

export async function getCategoryById(id: string) {
  return await db.query.categories.findFirst({
    where: eq(categories.id, id),
    with: {
      billboard: true,
    },
  })
}

export async function createCategory(values: TCategorySchema) {
  const category = await db
    .insert(categories)
    .values({ updatedAt: new Date(), ...values })
    .returning()
  return getFirstObject(category)
}

export async function updateCategory(
  values: TCategorySchema,
  categoryId: string
) {
  const { name, billboardId } = values

  const category = await db
    .update(categories)
    .set({ name, billboardId, updatedAt: new Date() })
    .where(eq(categories.id, categoryId))
    .returning()
  return getFirstObject(category)
}

export async function deleteCategory(categoryId: string) {
  const category = await db
    .delete(categories)
    .where(eq(categories.id, categoryId))
    .returning()
  return getFirstObject(category)
}

export async function getCategories(storeId: string) {
  return await db.query.categories.findMany({
    where: eq(categories.storeId, storeId),
  })
}
