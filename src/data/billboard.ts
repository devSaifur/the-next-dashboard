import { db } from '@/db'
import { billboards } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getBillboardById(storeId: string) {
  return await db.query.billboards.findFirst({
    where: eq(billboards.storeId, storeId),
  })
}
