'use server'

import { updateCategory } from '@/data/category'
import { getStoreByStoreAndUserId } from '@/data/store'
import { getUser } from '@/auth/getUser'
import {
  CategoryCreateUpdateSchema,
  TCategoryCreateUpdateSchema,
} from '@/lib/validators/ActionValidators'

export async function updateCategoryAction(
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

  const { name, categoryId, billboardId, storeId } = validatedFields.data

  const existingStore = await getStoreByStoreAndUserId(storeId, user.userId)

  if (!existingStore) {
    return { error: 'Unauthorize' }
  }

  try {
    await updateCategory({ name, categoryId, billboardId })
    return { success: 'Category updated successfully' }
  } catch (err) {
    return { error: 'Something went wrong. Please try again' }
  }
}
