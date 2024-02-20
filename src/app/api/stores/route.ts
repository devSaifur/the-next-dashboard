import { validateRequest } from '@/auth/auth'
import { db } from '@/db'
import { Store, stores } from '@/db/schema'
import { getFirstObject } from '@/utils/helpers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { user } = await validateRequest()
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = body

    if (!name) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const store = await createStore({
      name,
      userId: user.id,
      updatedAt: new Date(),
    })

    return NextResponse.json(store)
  } catch (err) {
    if (err instanceof Error) console.error(err.message)
    console.log(`[STORE POST]`, err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

async function createStore(value: Store) {
  try {
    const storeArr = await db.insert(stores).values(value).returning()
    return getFirstObject(storeArr)
  } catch (err) {
    if (err instanceof Error) console.error(err)
    console.log(err)
  }
}
