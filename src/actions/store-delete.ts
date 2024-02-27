'use server'

import { deleteStore } from '@/data/store'
import { getUser } from '@/auth/getUser'
import {
  StoreDeleteSchema,
  TStoreDeleteSchema,
} from '@/lib/validators/ActionValidators'

export async function deleteStoreAction(values: TStoreDeleteSchema) {
  const validatedFields = StoreDeleteSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const user = await getUser()

  if (!user) {
    return { error: 'Unauthorize' }
  }

  const id = validatedFields.data

  try {
    await deleteStore(id as string)
    return { success: 'Store deleted successfully' }
  } catch (err) {
    throw err
  }
}
