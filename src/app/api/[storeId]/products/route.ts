import { getStoreByStoreAndUserId } from '@/data/store'
import { getUserAuth } from '@/auth/utils'
import { ProductSchema } from '@/lib/validators/FormValidators'
import { NextResponse } from 'next/server'
import { createProduct } from '@/data/product'
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

    const productsRes = await db.query.products.findMany({
      where: and(
        eq(products.storeId, storeId),
        eq(products.isArchived, false),
        eq(products.categoryId, categoryId),
        eq(products.sizeId, sizeId),
        eq(products.colorId, colorId),
        eq(products.isFeatured, isFeatured ? true : false)
      ),
      columns: {
        id: true,
        name: true,
        price: true,
      },
      with: {
        images: {
          columns: {
            id: true,
            url: true,
          },
        },
        category: {
          columns: {
            id: true,
            name: true,
          },
        },
        color: {
          columns: {
            id: true,
            name: true,
            value: true,
          },
        },
        size: {
          columns: {
            id: true,
            name: true,
            value: true,
          },
        },
      },
    })

    return NextResponse.json(productsRes)
  } catch (err) {
    console.error('[PRODUCTS_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
