import { createBillboard, getBillboardByStoreId } from '@/data/billboard'
import { getStoreByStoreAndUserId } from '@/data/store'
import { getUser } from '@/auth/getUser'
import { BillboardSchema } from '@/lib/validators/ActionValidators'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const user = await getUser()

    if (!user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const body = await req.json()

    const validatedFields = BillboardSchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid input.', { status: 400 })
    }

    const { label, imageUrl } = validatedFields.data

    const usersStore = await getStoreByStoreAndUserId(storeId, user.userId)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const billboard = await createBillboard({ label, imageUrl }, storeId)

    return NextResponse.json(billboard)
  } catch (err) {
    console.error('[BILLBOARDS_POST]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const billboards = await getBillboardByStoreId(params.storeId)

    return NextResponse.json(billboards)
  } catch (err) {
    console.error('[BILLBOARDS_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
