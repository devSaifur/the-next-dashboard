'use server'

import { deleteBillboard } from '@/data/billboard'
import { getStoreByStoreAndUserId } from '@/data/store'
import { getUser } from '@/hooks/getUser'
import {
  BillboardDeleteSchema,
  TBillboardDeleteSchema,
} from '@/lib/validators/ActionValidators'

export async function deleteBillboardAction(values: TBillboardDeleteSchema) {
  const validatedFields = BillboardDeleteSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Billboard could not been found' }
  }

  const user = await getUser()

  if (!user) {
    return { error: 'Unauthenticated' }
  }

  const { billboardId, storeId } = validatedFields.data

  const existingStore = await getStoreByStoreAndUserId(storeId, user.userId)

  if (!existingStore) {
    return { error: 'Unauthorize' }
  }

  try {
    await deleteBillboard(billboardId)
    return { success: 'Billboard deleted successfully' }
  } catch (err) {
    return { error: 'Something went wrong, please try again.' }
  }
}
