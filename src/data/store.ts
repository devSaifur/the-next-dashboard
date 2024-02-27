'use server'

import { eq, and } from 'drizzle-orm'
import { db } from '@/db'
import { type TStoreInsertSchema, stores } from '@/db/schema'

export async function getStoreByUserId(userId: string) {
  try {
    const store = await db.query.stores.findFirst({
      where: eq(stores.userId, userId),
    })
    return store
  } catch (err) {
    console.error(err)
  }
}

export async function getStoreByStoreId(storeId: string) {
  try {
    const store = await db.query.stores.findFirst({
      where: eq(stores.id, storeId),
    })
    return store
  } catch (err) {
    console.error(err)
  }
}

export async function getAllStoreByUserId(userId: string) {
  try {
    const allStore = await db.query.stores.findMany({
      where: eq(stores.userId, userId),
    })
    return allStore
  } catch (err) {
    console.error(err)
  }
}

export async function createStore(value: TStoreInsertSchema) {
  try {
    await db.insert(stores).values(value)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function updateStoreName(storeId: string, name: string) {
  try {
    return await db.update(stores).set({ name }).where(eq(stores.id, storeId))
  } catch (err) {
    console.error(err)
  }
}

export async function deleteStore(storeId: string) {
  try {
    await db.delete(stores).where(eq(stores.id, storeId))
  } catch (err) {
    throw err
  }
}

export async function getStoreByStoreAndUserId(
  storeId: string,
  userId: string
) {
  try {
    return await db.query.stores.findFirst({
      where: and(eq(stores.id, storeId), eq(stores.userId, userId)),
    })
  } catch (err) {
    console.error(err)
  }
}
