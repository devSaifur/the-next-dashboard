'use server'

import { updateStoreName } from '@/data/store'
import { getUser } from '@/hooks/getUser'
import { SettingsFormValidator } from '@/lib/validators/FormValidators'
import { createSafeActionClient } from 'next-safe-action'

const action = createSafeActionClient()

export const updateStoreAction = action(
  SettingsFormValidator,
  async (values) => {
    const validatedFields = SettingsFormValidator.safeParse(values)

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
)
