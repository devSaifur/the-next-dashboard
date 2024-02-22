'use server'

import { getUser } from '@/hooks/getUser'
import { FormValidator } from '@/lib/validators/FormValidators'
import { createStore } from '@/data/store'
import { createSafeActionClient } from 'next-safe-action'

const action = createSafeActionClient()

export const createStoreAction = action(FormValidator, async (values) => {
  const validatedFields = FormValidator.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const user = await getUser()

  if (!user) {
    return { error: 'Unauthorize' }
  }

  const { name } = validatedFields.data

  try {
    await createStore({
      name,
      userId: user.userId,
      updatedAt: new Date(),
    })
    return { success: 'Store created successfully' }
  } catch (err) {
    if (err instanceof Error) console.error(err.message)
    return { error: 'Something went wrong' }
  }
})
