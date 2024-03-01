import { NextResponse } from 'next/server'

import { getStoreByStoreAndUserId } from '@/data/store'
import { getUser } from '@/auth/getUser'
import { ColorSchema } from '@/lib/validators/ActionValidators'
import { createColor, getColorsByStoreId } from '@/data/color'

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

    const validatedFields = ColorSchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid input.', { status: 400 })
    }

    const { name, value } = validatedFields.data

    const usersStore = await getStoreByStoreAndUserId(storeId, user.userId)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const color = await createColor({ name, value }, storeId)

    return NextResponse.json(color)
  } catch (err) {
    console.error('[COLORS_POST]', err)
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

    const colors = await getColorsByStoreId(storeId)

    return NextResponse.json(colors)
  } catch (err) {
    console.error('[COLORS_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
