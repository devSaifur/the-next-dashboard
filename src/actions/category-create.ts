'use server'

import { createCategory } from '@/data/category'
import { getStoreByStoreAndUserId } from '@/data/store'
import { getUser } from '@/auth/getUser'
import {
  CategoryCreateUpdateSchema,
  TCategoryCreateUpdateSchema,
} from '@/lib/validators/ActionValidators'

export async function createCategoryAction(
  values: TCategoryCreateUpdateSchema
) {
  const validatedFields = CategoryCreateUpdateSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const user = await getUser()

  if (!user) {
    return { error: 'Unauthenticated' }
  }

  const { storeId } = validatedFields.data

  const existingStore = await getStoreByStoreAndUserId(storeId, user.userId)

  if (!existingStore) {
    return { error: 'Unauthorize' }
  }

  try {
    await createCategory(values)
    return { success: 'Category created successfully' }
  } catch (err) {
    console.error(err)
    return { error: 'Something went wrong! please try again.' }
  }
}
