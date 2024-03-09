import { NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'

import { getUserAuth } from '@/auth/utils'
import { ProductSchema } from '@/lib/validators/FormValidators'
import { products } from '@/db/schema'
import { getStoreByStoreAndUserId } from '@/data/store'
import { createProduct, getFilteredProducts } from '@/data/product'

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

    const validatedFields = ProductSchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid fields.', { status: 400 })
    }

    const { data } = validatedFields

    const usersStore = await getStoreByStoreAndUserId(storeId, session.user.id)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const product = await createProduct({ storeId, ...data })

    return NextResponse.json(product)
  } catch (err) {
    console.error('[PRODUCTS_POST]', err)
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

    const { searchParams } = new URL(req.url)

    const categoryId = searchParams.get('categoryId')
    const sizeId = searchParams.get('sizeId')
    const colorId = searchParams.get('colorId')
    const isFeatured = searchParams.get('isFeatured') === 'true'

    let filter = null

    const conditions = []

    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId))
    }
    if (sizeId) {
      conditions.push(eq(products.sizeId, sizeId))
    }
    if (colorId) {
      conditions.push(eq(products.colorId, colorId))
    }
    if (isFeatured) {
      conditions.push(eq(products.isFeatured, isFeatured))
    }

    if (conditions.length > 0) {
      filter = and(
        eq(products.storeId, storeId),
        eq(products.isArchived, false),
        ...conditions
      )
    }

    const productsRes = await getFilteredProducts(filter)

    return NextResponse.json(productsRes)
  } catch (err) {
    console.error('[PRODUCTS_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
