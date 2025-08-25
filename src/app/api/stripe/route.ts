// src/app/api/stripe/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: { json: () => PromiseLike<{ matchId: any; email: any; }> | { matchId: any; email: any; }; }) {
  const { matchId, email } = await req.json();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'zar',
        product_data: { name: 'Playdiski Entry' },
        unit_amount: 2000, // R20 in cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/play/${matchId}/paid?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/play/${matchId}`,
    client_reference_id: matchId.toString(),
    customer_email: email,
  });
  return NextResponse.json({ id: session.id });
}