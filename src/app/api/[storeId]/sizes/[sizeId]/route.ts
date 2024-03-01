import { NextResponse } from 'next/server'
import { getUser } from '@/auth/getUser'
import { getStoreByStoreAndUserId } from '@/data/store'
import { SizeSchema } from '@/lib/validators/ActionValidators'
import { deleteSizeById, getSizeById, updateSize } from '@/data/size'

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    const { sizeId } = params

    if (!sizeId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    const size = await getSizeById(sizeId)

    return NextResponse.json(size)
  } catch (err) {
    console.log('[SIZE_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const user = await getUser()

    if (!user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const { storeId, sizeId } = params
    const { userId } = user

    if (!sizeId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    const usersStore = getStoreByStoreAndUserId(storeId, userId)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const billboard = await deleteSizeById(sizeId)

    return NextResponse.json(billboard)
  } catch (err) {
    console.error('[SIZE_DELETE]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const user = await getUser()

    if (!user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const body = await req.json()

    const validatedFields = SizeSchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid fields', { status: 400 })
    }

    const { name, value } = validatedFields.data

    const { sizeId, storeId } = params

    if (!sizeId) {
      return new NextResponse('Size is required', { status: 400 })
    }

    if (!storeId) {
      return new NextResponse('Store is required', { status: 400 })
    }

    const usersStore = await getStoreByStoreAndUserId(storeId, user.userId)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const updatedSize = await updateSize({ name, value }, sizeId)

    return NextResponse.json(updatedSize)
  } catch (err) {
    console.error('[SIZE_PATCH]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
