import { getUser } from '@/auth/getUser'
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from '@/data/category'
import { getStoreByStoreAndUserId } from '@/data/store'
import { CategorySchema } from '@/lib/validators/ActionValidators'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 })
    }

    const category = await getCategoryById(categoryId)

    return NextResponse.json(category)
  } catch (err) {
    console.error('[CATEGORY_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const user = await getUser()

    if (!user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const body = await req.json()

    const validatedFields = CategorySchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid fields', { status: 400 })
    }

    const { categoryId, storeId } = params

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 })
    }

    const { userId } = user

    const usersStore = await getStoreByStoreAndUserId(storeId, userId)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const { name, billboardId } = validatedFields.data

    const category = await updateCategory({ name, billboardId }, categoryId)

    return NextResponse.json(category)
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string; storeId: string } }
) {
  try {
    const user = await getUser()

    if (!user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const { categoryId, storeId } = params

    if (!categoryId || !storeId) {
      return new NextResponse('Invalid fields', { status: 400 })
    }

    const { userId } = user

    const usersStore = await getStoreByStoreAndUserId(storeId, userId)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const category = await deleteCategory(categoryId)

    return NextResponse.json(category)
  } catch (err) {
    console.error('[CATEGORY_DELETE]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
