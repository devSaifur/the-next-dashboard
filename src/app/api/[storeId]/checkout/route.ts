import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import { getProductsByIds } from '@/data/product'
import { initiateOrder } from '@/data/order'
import { env } from '@/lib/env'

const corsHeaders: HeadersInit = {
  'Access-Control-Allow-Origin': env.FRONTEND_STORE_URL,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders, status: 200 })
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json()

  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product Ids are required', { status: 400 })
  }

  const products = await getProductsByIds(productIds)

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: Number(product.price) * 100,
      },
    })
  })

  const { storeId } = params

  const order = await initiateOrder({ storeId, productIds })

  if (!order) {
    return new NextResponse('Could not initiate order', { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  })

  const responseBody = JSON.stringify({ url: session.url })

  return new Response(responseBody, {
    status: 200,
    headers: corsHeaders,
  })
}
