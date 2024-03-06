import { getStoreByStoreAndUserId } from '@/data/store'
import { getUserAuth } from '@/auth/utils'
import { ProductSchema } from '@/lib/validators/FormValidators'
import { NextResponse } from 'next/server'
import { createProduct, getFilteredProducts } from '@/data/product'
import { db } from '@/db'
import { and, eq } from 'drizzle-orm'
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

    console.log({ data })

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

    let filter

    switch (true) {
      case !!categoryId:
        filter = eq(products.categoryId, categoryId)
        break
      case !!sizeId:
        filter = eq(products.sizeId, sizeId)
        break
      case !!colorId:
        filter = eq(products.colorId, colorId)
        break
      case !!isFeatured:
        filter = eq(products.isFeatured, isFeatured ? true : false)
        break
      default:
        break
    }

    const productsRes = await getFilteredProducts(filter, storeId)

    return NextResponse.json(productsRes)
  } catch (err) {
    console.error('[PRODUCTS_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
