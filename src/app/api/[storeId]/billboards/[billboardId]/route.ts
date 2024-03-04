import { NextResponse } from 'next/server'
import {
  deleteBillboardById,
  getBillboardById,
  updateBillboard,
} from '@/data/billboard'
import { getStoreByStoreAndUserId } from '@/data/store'
import { BillboardSchema } from '@/lib/validators/ActionValidators'
import { getUserAuth } from '@/auth/utils'

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    const billboard = await getBillboardById(params.billboardId)

    return NextResponse.json(billboard)
  } catch (err) {
    console.log('[BILLBOARD_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { session } = await getUserAuth()

    if (!session?.user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    const usersStore = getStoreByStoreAndUserId(params.storeId, session.user.id)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const billboard = await deleteBillboardById(params.billboardId)

    return NextResponse.json(billboard)
  } catch (err) {
    console.error('[BILLBOARD_DELETE]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { session } = await getUserAuth()

    if (!session) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const body = await req.json()

    const validatedFields = BillboardSchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid fields', { status: 400 })
    }

    const { label, imageUrl } = validatedFields.data

    const { billboardId, storeId } = params

    if (!billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const usersStore = await getStoreByStoreAndUserId(storeId, session.user.id)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const updatedBillboard = await updateBillboard(
      { label, imageUrl },
      billboardId
    )

    return NextResponse.json(updatedBillboard)
  } catch (err) {
    console.error('[BILLBOARD_PATCH]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
