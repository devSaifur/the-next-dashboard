import { createCategory, getCategories } from '@/data/category'
import { getStoreByStoreAndUserId } from '@/data/store'
import { getUserAuth } from '@/auth/utils'
import { CategorySchema } from '@/lib/validators/ActionValidators'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const categories = await getCategories(storeId)

    return NextResponse.json(categories)
  } catch (error) {
    console.log('[CATEGORIES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { session } = await getUserAuth()

    if (!session) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const body = await req.json()

    const validatedFields = CategorySchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid fields', { status: 400 })
    }

    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Missing queries', { status: 400 })
    }

    const usersStore = getStoreByStoreAndUserId(storeId, session.user.id)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const { name, billboardId } = validatedFields.data

    const category = await createCategory({
      name,
      billboardId,
      storeId,
      updatedAt: new Date(),
    })

    return NextResponse.json(category)
  } catch (err) {
    console.log('[CATEGORIES_POST]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
