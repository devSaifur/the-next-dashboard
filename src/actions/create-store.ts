'use server'

import { validateRequest } from '@/auth/auth'
import { db } from '@/db'
import { Store, stores } from '@/db/schema'
import { FormValidator } from '@/lib/validators/FormValidators'
import { getFirstObject } from '@/utils/helpers'
import { createSafeActionClient } from 'next-safe-action'

const action = createSafeActionClient()

export const createStoreAction = action(FormValidator, async (values) => {
  const validatedFields = FormValidator.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name } = validatedFields.data

  try {
    const { user } = await validateRequest()
    if (!user) {
      return { error: 'Unauthorize' }
    }

    if (!name) {
      return { error: 'Name is required' }
    }

    await createStore({
      name,
      userId: user.id,
      updatedAt: new Date(),
    })

    return { success: 'Store created successfully' }
  } catch (err) {
    if (err instanceof Error) console.error(err.message)
    return { error: 'Something went wrong' }
  }
})

async function createStore(value: Store) {
  try {
    const storeArr = await db.insert(stores).values(value).returning()
    return getFirstObject(storeArr)
  } catch (err) {
    if (err instanceof Error) console.error(err)
    console.log(err)
  }
}
