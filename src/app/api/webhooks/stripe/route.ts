import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

import { createOrder } from '@/data/order'
import { stripe } from '@/lib/stripe'
import { env } from '@/lib/env'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') ?? ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`,
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session
  const address = session.customer_details?.address
  const phone = session.customer_details?.phone || null

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

  switch (event.type) {
    case 'checkout.session.completed':
      await createOrder({ orderId, addressString, phone })
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return new NextResponse(null, { status: 200 })
}
