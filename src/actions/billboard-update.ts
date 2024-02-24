'use server'

import { updateBillboard } from '@/data/billboard'
import { getStoreByStoreAndUserId } from '@/data/store'
import { getUser } from '@/hooks/getUser'
import {
  BillboardCreateUpdateSchema,
  TBillboardCreateUpdateSchema,
} from '@/lib/validators/ActionValidators'

export async function updateBillboardAction(
  values: TBillboardCreateUpdateSchema
) {
  const validatedFields = BillboardCreateUpdateSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const user = await getUser()

  if (!user) {
    return { error: 'Unauthenticated' }
  }

  const { label, imageUrl, storeId, billboardId } = validatedFields.data

  const existingStore = await getStoreByStoreAndUserId(storeId, user.userId)

  if (!existingStore) {
    return { error: 'Unauthorize' }
  }

  try {
    await updateBillboard({ label, imageUrl }, billboardId)
    return { success: 'Billboard successfully updated' }
  } catch (err) {
    console.error(err)
    return { error: 'Something went wrong, please try again.' }
  }
}
