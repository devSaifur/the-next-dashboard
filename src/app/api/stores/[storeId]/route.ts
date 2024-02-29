import { deleteStore, updateStore } from '@/data/store'
import { getUser } from '@/auth/getUser'
import {
  StoreDeleteSchema,
  StoreUpdateSchema,
} from '@/lib/validators/ActionValidators'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const validatedFields = StoreUpdateSchema.safeParse(body)

    if (!validatedFields.success) {
      return { error: 'Invalid fields' }
    }

    const user = await getUser()

    if (!user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const { name, storeId } = validatedFields.data
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

    const validatedFields = StoreDeleteSchema.safeParse(storeId)

    if (!validatedFields.success) {
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
