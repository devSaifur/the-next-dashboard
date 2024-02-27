'use server'

import { updateStoreName } from '@/data/store'
import { getUser } from '@/auth/getUser'
import {
  StoreUpdateSchema,
  TStoreUpdateSchema,
} from '@/lib/validators/ActionValidators'

export async function updateStoreAction(values: TStoreUpdateSchema) {
  const validatedFields = StoreUpdateSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const user = await getUser()

  if (!user) {
    return { error: 'Unauthenticated' }
  }

  const { name, storeId } = validatedFields.data

  try {
    await updateStoreName(storeId, name)
    return { success: 'Store updated successfully' }
  } catch (err) {
    if (err instanceof Error) console.error(err.message)
    return { error: 'Something went wring!' }
  }
}
