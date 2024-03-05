import { getStoreByStoreAndUserId } from '@/data/store'
import { SizeSchema } from '@/lib/validators/FormValidators'
import { NextResponse } from 'next/server'
import { createSize, getSizesByStoreId } from '@/data/size'
import { getUserAuth } from '@/auth/utils'

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { session } = await getUserAuth()

    if (!session) {
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

    const usersStore = await getStoreByStoreAndUserId(storeId, session.user.id)

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
