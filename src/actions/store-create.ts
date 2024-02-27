'use server'

import { getUser } from '@/auth/getUser'
import {
  TStoreCreateSchema,
  StoreCreateSchema,
} from '@/lib/validators/ActionValidators'
import { createStore } from '@/data/store'

export async function createStoreAction(values: TStoreCreateSchema) {
  const validatedFields = StoreCreateSchema.safeParse(values)

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
}
