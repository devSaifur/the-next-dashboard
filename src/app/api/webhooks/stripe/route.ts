import { db } from '@/db'
import { orderItems, orders, products } from '@/db/schema'
import { stripe } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') ?? ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session
  const address = session.customer_details?.address

  const addressComponent = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]

  const addressString = addressComponent.filter((c) => c !== null).join(', ')

  const orderId = session.metadata?.orderId as string

  console.log({ orderId })

  switch (event.type) {
    case 'checkout.session.completed':
      const order = await db
        .update(orders)
        .set({
          isPaid: true,
          address: addressString,
          phone: session.customer_details?.phone || '',
        })
        .where(eq(orders.id, orderId))
        .returning()

      const orderItemsRes = await db.query.orderItems.findMany({
        where: eq(orderItems.orderId, order[0].id),
      })

      const productIds = orderItemsRes.map((orderItem) => orderItem.productId)

      productIds.forEach(async (productId) => {
        await db
          .update(products)
          .set({ isArchived: true })
          .where(eq(products.id, productId))
      })
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return new NextResponse(null, { status: 200 })
}
