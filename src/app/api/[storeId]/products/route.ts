import { getStoreByStoreAndUserId } from '@/data/store'
import { getUserAuth } from '@/auth/utils'
import { ProductSchema } from '@/lib/validators/FormValidators'
import { NextResponse } from 'next/server'
import { createProduct, getFilteredProducts } from '@/data/product'
import { and, eq, type SQL } from 'drizzle-orm'
import { products } from '@/db/schema'

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

    const categoryId = searchParams.get('categoryId') as string
    const sizeId = searchParams.get('sizeId') as string
    const colorId = searchParams.get('colorId') as string
    const isFeatured = searchParams.get('isFeatured') as string

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
      conditions.push(eq(products.isFeatured, isFeatured === 'true'))
    }

    if (conditions.length > 0) {
      filter = and(eq(products.storeId, storeId), ...conditions)
    }

    const productsRes = await getFilteredProducts(filter)

    return NextResponse.json(productsRes)
  } catch (err) {
    console.error('[PRODUCTS_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
