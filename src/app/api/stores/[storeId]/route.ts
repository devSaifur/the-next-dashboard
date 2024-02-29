import { deleteStore, updateStore } from '@/data/store'
import { getUser } from '@/auth/getUser'

import { NextResponse } from 'next/server'
import { StoreSchema } from '@/lib/validators/ActionValidators'

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json()

    const validatedFields = StoreSchema.safeParse(body)

    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const user = await getUser()

    if (!user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const { name } = validatedFields.data
    const { storeId } = params
    const { userId } = user

    const store = await updateStore(storeId, userId, name)
    return NextResponse.json(store)
  } catch (err) {
    console.error('[STORE_PATCH]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Invalid fields', { status: 400 })
    }

    const user = await getUser()

    if (!user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const store = await deleteStore(storeId)
    return NextResponse.json(store)
  } catch (err) {
    console.error('[STORE_DELETE]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
