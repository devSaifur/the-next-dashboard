'use server'

import { deleteStore } from '@/data/store'
import { getUser } from '@/hooks/getUser'
import { DeleteStoreValidator } from '@/lib/validators/ActionValidators'
import { createSafeActionClient } from 'next-safe-action'

const action = createSafeActionClient()

export const deleteStoreAction = action(
  DeleteStoreValidator,
  async (values) => {
    const validatedFields = DeleteStoreValidator.safeParse(values)

    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const user = await getUser()

    if (!user) {
      return { error: 'Unauthorize' }
    }

    const storeId = validatedFields.data

    try {
      await deleteStore(storeId)
      return { success: 'Store deleted successfully' }
    } catch (err) {
      console.error(err)
      return { error: 'Something went wrong' }
    }
  }
)
