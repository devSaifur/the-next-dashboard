import { NextResponse } from 'next/server'
import { getUser } from '@/auth/getUser'
import {
  deleteBillboardById,
  getBillboardById,
  updateBillboard,
} from '@/data/billboard'
import { getStoreByStoreAndUserId } from '@/data/store'
import {
  BillboardSchema,
  TBillboardSchema,
} from '@/lib/validators/ActionValidators'

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
  } catch (error) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const user = await getUser()

    if (!user?.userId) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 })
    }

    const usersStore = getStoreByStoreAndUserId(params.storeId, user.userId)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const billboard = await deleteBillboardById(params.billboardId)

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const user = await getUser()

    if (!user) {
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

    const usersStore = await getStoreByStoreAndUserId(storeId, user.userId)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const updatedBillboard = await updateBillboard(
      { label, imageUrl },
      billboardId
    )

    return NextResponse.json(updatedBillboard)
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
