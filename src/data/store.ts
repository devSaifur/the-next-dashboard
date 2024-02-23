'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { type TStoreInsertSchema, stores } from '@/db/schema'

export async function getStoreByUserId(userId: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  })
  return store
}

export async function getStoreByStoreId(storeId: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  })
  return store
}

export async function getAllStoreByUserId(userId: string) {
  const allStore = await db.query.stores.findMany({
    where: eq(stores.userId, userId),
  })
  return allStore
}

export async function createStore(value: TStoreInsertSchema) {
  try {
    await db.insert(stores).values(value)
  } catch (err) {
    console.error(err)
  }
}

export async function updateStoreName(storeId: string, name: string) {
  await db.update(stores).set({ name }).where(eq(stores.id, storeId))
}

export async function deleteStore(storeId: string) {
  await db.delete(stores).where(eq(stores.id, storeId))
}
