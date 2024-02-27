'use server'

import { deleteCategory } from '@/data/category'
import { getStoreByStoreAndUserId } from '@/data/store'
import { getUser } from '@/auth/getUser'
import {
  CategoryDeleteSchema,
  TCategoryDeleteSchema,
} from '@/lib/validators/ActionValidators'

export async function deleteCategoryAction(values: TCategoryDeleteSchema) {
  const validatedFields = CategoryDeleteSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Category does not exist!' }
  }

  const user = await getUser()

  if (!user) {
    return { error: 'Unauthenticated' }
  }

  const { storeId, categoryId } = validatedFields.data

  const existingStore = await getStoreByStoreAndUserId(storeId, user.userId)

  if (!existingStore) {
    return { error: 'Unauthenticated' }
  }

  try {
    await deleteCategory(categoryId)
    return { success: 'Category successfully deleted' }
  } catch (err) {
    return { error: 'Something went wrong, please try again.' }
  }
}
