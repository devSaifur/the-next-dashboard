import { NextResponse } from 'next/server'
import { getStoreByStoreAndUserId } from '@/data/store'
import { ProductSchema } from '@/lib/validators/FormValidators'
import { getUserAuth } from '@/auth/utils'
import {
  deleteProductById,
  getProductById,
  updateProduct,
} from '@/data/product'

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params

    if (!productId) {
      return new NextResponse('Product is required', { status: 400 })
    }

    const product = await getProductById(productId)

    return NextResponse.json(product)
  } catch (err) {
    console.error('[PRODUCT_GET]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { session } = await getUserAuth()

    if (!session?.user) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const { productId, storeId } = params

    if (!productId) {
      return new NextResponse('Product is required', { status: 400 })
    }

    const usersStore = getStoreByStoreAndUserId(storeId, session.user.id)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const product = await deleteProductById(productId)

    return NextResponse.json(product)
  } catch (err) {
    console.error('[PRODUCT_DELETE]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { session } = await getUserAuth()

    if (!session) {
      return new NextResponse('Unauthenticated', { status: 403 })
    }

    const body = await req.json()

    const validatedFields = ProductSchema.safeParse(body)

    if (!validatedFields.success) {
      return new NextResponse('Invalid fields', { status: 400 })
    }

    const { data } = validatedFields

    const { productId, storeId } = params

    if (!productId) {
      return new NextResponse('Product is required', { status: 400 })
    }

    if (!storeId) {
      return new NextResponse('Store is required', { status: 400 })
    }

    const usersStore = await getStoreByStoreAndUserId(storeId, session.user.id)

    if (!usersStore) {
      return new NextResponse('Unauthorized', { status: 405 })
    }

    const updatedProduct = await updateProduct({ productId, ...data })

    return NextResponse.json(updatedProduct)
  } catch (err) {
    console.error('[PRODUCT_PATCH]', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}
