import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { TCategoryInsertSchema, categories } from '@/db/schema'
import { TCategorySchema } from '@/lib/validators/ActionValidators'
import { getFirstObject } from '@/utils/helpers'

export async function getCategoriesByStoreId(storeId: string) {
  return await db.query.categories.findMany({
    where: eq(categories.storeId, storeId),
    with: {
      billboard: true,
    },
    orderBy: [desc(categories.createdAt)],
  })
}

export async function getCategoriesById(id: string | null) {
  if (id) {
    return await db.query.categories.findFirst({
      where: eq(categories.id, id),
      columns: {
        name: true,
        billboardId: true,
        storeId: true,
      },
    })
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

export async function createCategory(values: TCategoryInsertSchema) {
  const category = await db.insert(categories).values(values).returning()
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
