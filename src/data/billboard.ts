import { db } from '@/db'
import { billboards } from '@/db/schema'
import {
  TBillboardCreateUpdateSchema,
  TBillboardDeleteSchema,
} from '@/lib/validators/ActionValidators'
import { desc, eq } from 'drizzle-orm'

export async function getBillboardById(id: string) {
  try {
    const data = await db.query.billboards.findFirst({
      where: eq(billboards.id, id),
    })
    if (!data) return null
    return data
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getBillboardByStoreId(storeId: string) {
  const data = await db.query.billboards.findMany({
    where: eq(billboards.storeId, storeId),
    orderBy: [desc(billboards.createdAt)],
  })
  if (!data) return null
  return data
}

export async function createBillboard(
  values: Omit<TBillboardCreateUpdateSchema, 'billboardId'>
) {
  try {
    await db.insert(billboards).values({
      updatedAt: new Date(),
      ...values,
    })
  } catch (err) {
    console.error(err)
  }
}

export async function updateBillboard(
  values: Omit<TBillboardCreateUpdateSchema, 'billboardId' | 'storeId'>,
  billboardId: string
) {
  try {
    await db
      .update(billboards)
      .set(values)
      .where(eq(billboards.id, billboardId))
  } catch (err) {
    console.error(err)
  }
}

export async function deleteBillboard(billboardId: string) {
  try {
    await db.delete(billboards).where(eq(billboards.id, billboardId))
  } catch (err) {
    console.error(err)
  }
}
