import { getUser } from '@/auth/getUser'
import { createStore } from '@/data/store'
import { StoreSchema } from '@/lib/validators/ActionValidators'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validatedFields = StoreSchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid fields', { status: 400 })
    }

    const user = await getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const { name } = validatedFields.data

    const store = await createStore({
      name,
      userId: user.userId,
      updatedAt: new Date(),
    })
    return NextResponse.json(store)
  } catch (err) {
    console.error('[STORES_POST]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
