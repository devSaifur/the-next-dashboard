import { deleteStore, updateStore } from '@/data/store'
import { getUserAuth } from '@/auth/utils'

import { NextResponse } from 'next/server'
import { StoreSchema } from '@/lib/validators/FormValidators'

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

    const { session } = await getUserAuth()

    if (!session) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const { name } = validatedFields.data
    const { storeId } = params

    const store = await updateStore(storeId, session.user.id, name)
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

    const { session } = await getUserAuth()

    if (!session) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const store = await deleteStore(storeId)
    return NextResponse.json(store)
  } catch (err) {
    console.error('[STORE_DELETE]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
