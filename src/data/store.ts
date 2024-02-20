import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { stores } from '@/db/schema'

export async function getStoreByUserId(userId: string) {
  try {
    const store = await db.query.stores.findFirst({
      where: eq(stores.userId, userId),
    })
    return store
  } catch (err) {
    if (err instanceof Error) console.error(err.message)
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
    if (err instanceof Error) console.error(err.message)
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
    if (err instanceof Error) console.error(err.message)
    console.error(err)
  }
}

export async function updateStoreName(storeId: string, name: string) {
  try {
    await db.update(stores).set({ name }).where(eq(stores.id, storeId))
  } catch (err) {
    if (err instanceof Error) console.error(err.message)
    console.error(err)
  }
}
