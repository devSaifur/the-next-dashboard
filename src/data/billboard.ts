import 'server-only'
import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { billboards } from '@/db/schema'
import { TBillboardSchema } from '@/lib/validators/FormValidators'

export async function getBillboardById(id: string | null) {
  if (id) {
    return await db.query.billboards.findFirst({
      where: eq(billboards.id, id),
    })
  }
}

export async function getBillboardsByStoreId(storeId: string) {
  return await db.query.billboards.findMany({
    where: eq(billboards.storeId, storeId),
    orderBy: [desc(billboards.createdAt)],
  })
}

export async function createBillboard(
  values: TBillboardSchema & {
    storeId: string
  }
) {
  const billboardArr = await db
    .insert(billboards)
    .values({
      updatedAt: new Date(),
      ...values,
    })
    .returning()

  const [billboard] = billboardArr
  return billboard
}

export async function updateBillboard(
  values: TBillboardSchema,
  billboardId: string
) {
  const billboardArr = await db
    .update(billboards)
    .set(values)
    .where(eq(billboards.id, billboardId))
    .returning()

  const [billboard] = billboardArr
  return billboard
}

export async function deleteBillboardById(billboardId: string) {
  const billboardArr = await db
    .delete(billboards)
    .where(eq(billboards.id, billboardId))
    .returning()

  const [billboard] = billboardArr
  return billboard
}
