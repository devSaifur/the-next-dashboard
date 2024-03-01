import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { colors } from '@/db/schema'
import { TColorSchema } from '@/lib/validators/ActionValidators'
import { getFirstObject } from '@/utils/helpers'

export async function getColorById(id: string | null) {
  if (id) {
    return db.query.colors.findFirst({
      where: eq(colors.id, id),
    })
  }
}

export async function getColorsByStoreId(storeId: string) {
  return db.query.colors.findMany({
    where: eq(colors.storeId, storeId),
    orderBy: [desc(colors.createdAt)],
  })
}

export async function createColor(value: TColorSchema, storeId: string) {
  const colorArr = await db
    .insert(colors)
    .values({ storeId, updatedAt: new Date(), ...value })
    .returning()

  return getFirstObject(colorArr)
}

export async function deleteColorById(id: string) {
  const sizeArr = await db.delete(colors).where(eq(colors.id, id)).returning()
  return getFirstObject(sizeArr)
}

export async function updateColor(values: TColorSchema, colorId: string) {
  const colorArr = await db
    .update(colors)
    .set(values)
    .where(eq(colors.id, colorId))
    .returning()
  return getFirstObject(colorArr)
}
