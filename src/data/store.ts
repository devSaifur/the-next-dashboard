import 'server-only'
import { eq, and } from 'drizzle-orm'

import { db } from '@/db'
import { type TStoreInsertSchema, stores } from '@/db/schema'
import { getFirstObject } from '@/utils/helpers'

export async function getStoreByUserId(userId: string) {
  return await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  })
}

export async function getStoreById(storeId: string) {
  return await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  })
}

export async function getAllStoreByUserId(userId: string) {
  return await db.query.stores.findMany({
    where: eq(stores.userId, userId),
  })
}

export async function createStore(value: TStoreInsertSchema) {
  const store = await db.insert(stores).values(value).returning()
  return getFirstObject(store)
}

export async function updateStore(
  storeId: string,
  userId: string,
  name: string
) {
  const storeArr = await db
    .update(stores)
    .set({ name })
    .where(and(eq(stores.id, storeId), eq(stores.userId, userId)))
    .returning()
  return getFirstObject(storeArr)
}

export async function deleteStore(storeId: string) {
  const store = await db
    .delete(stores)
    .where(eq(stores.id, storeId))
    .returning()
  return getFirstObject(store)
}

export async function getStoreByStoreAndUserId(
  storeId: string,
  userId: string
) {
  return await db.query.stores.findFirst({
    where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
  })
}
