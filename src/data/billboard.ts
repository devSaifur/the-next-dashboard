import { db } from '@/db'
import { billboards } from '@/db/schema'
import { TBillboardCreateUpdateSchema } from '@/lib/validators/ActionValidators'
import { eq } from 'drizzle-orm'

export async function getBillboardById(id: string) {
  try {
    return await db.query.billboards.findFirst({
      where: eq(billboards.id, id),
    })
  } catch (err) {
    return undefined
  }
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
