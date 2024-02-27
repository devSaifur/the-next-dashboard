import { db } from '@/db'
import { billboards } from '@/db/schema'
import { TBillboardSchema } from '@/lib/validators/ActionValidators'
import { getFirstObject } from '@/utils/helpers'
import { desc, eq } from 'drizzle-orm'

export async function getBillboardById(id: string) {
  try {
    const data = await db.query.billboards.findFirst({
      where: eq(billboards.id, id),
    })
    if (!data) return null
    return data
  } catch (err) {
    return null
  }
}

export async function getBillboardByStoreId(storeId: string) {
  const data = await db.query.billboards.findMany({
    where: eq(billboards.storeId, storeId),
    orderBy: [desc(billboards.createdAt)],
  })
  return data
}

export async function createBillboard(
  values: TBillboardSchema,
  storeId: string
) {
  try {
    const billboardArr = await db
      .insert(billboards)
      .values({
        updatedAt: new Date(),
        storeId,
        ...values,
      })
      .returning()
    const billboard = getFirstObject(billboardArr)
    return billboard
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function updateBillboard(
  values: TBillboardSchema,
  billboardId: string
) {
  try {
    const billboard = await db
      .update(billboards)
      .set(values)
      .where(eq(billboards.id, billboardId))
      .returning()

    return getFirstObject(billboard)
  } catch (err) {
    console.error(err)
  }
}

export async function deleteBillboardById(billboardId: string) {
  try {
    const billboardArr = await db
      .delete(billboards)
      .where(eq(billboards.id, billboardId))
      .returning()
    return getFirstObject(billboardArr)
  } catch (err) {
    console.error(err)
  }
}
