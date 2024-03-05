import { NextResponse } from 'next/server'
import { getStoreByStoreAndUserId } from '@/data/store'
import { ColorSchema } from '@/lib/validators/FormValidators'
import { deleteColorById, getColorById, updateColor } from '@/data/color'
import { getUserAuth } from '@/auth/utils'

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    const { colorId } = params

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 })
    }

    const color = await getColorById(colorId)

    return NextResponse.json(color)
  } catch (err) {
    console.error('[COLOR_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { session } = await getUserAuth()

    if (!session) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const { storeId, colorId } = params

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 })
    }

    const usersStore = getStoreByStoreAndUserId(storeId, session.user.id)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const color = await deleteColorById(colorId)

    return NextResponse.json(color)
  } catch (err) {
    console.error('[COLOR_DELETE]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { session } = await getUserAuth()

    if (!session) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const body = await req.json()

    const validatedFields = ColorSchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid fields', { status: 400 })
    }

    const { name, value } = validatedFields.data

    const { colorId, storeId } = params

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 })
    }

    if (!storeId) {
      return new NextResponse('Store is required', { status: 400 })
    }

    const usersStore = await getStoreByStoreAndUserId(storeId, session.user.id)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const updatedColor = await updateColor({ name, value }, colorId)

    return NextResponse.json(updatedColor)
  } catch (err) {
    console.error('[COLOR_PATCH]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
