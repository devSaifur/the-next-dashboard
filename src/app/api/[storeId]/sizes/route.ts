import { getStoreByStoreAndUserId } from '@/data/store'
import { getUser } from '@/auth/getUser'
import { SizeSchema } from '@/lib/validators/ActionValidators'
import { NextResponse } from 'next/server'
import { createSize, getSizesByStoreId } from '@/data/size'

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

    const validatedFields = SizeSchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid input.', { status: 400 })
    }

    const { name, value } = validatedFields.data

    const usersStore = await getStoreByStoreAndUserId(storeId, user.userId)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const size = await createSize({ name, value }, storeId)

    return NextResponse.json(size)
  } catch (err) {
    console.error('[SIZES_POST]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const sizes = await getSizesByStoreId(storeId)

    return NextResponse.json(sizes)
  } catch (err) {
    console.error('[BILLBOARDS_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
