import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { authenticate } from '@/lib/auth-middleware';

export async function POST(req) {
  const user = await authenticate(req);
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

  try {
    const { items, customer } = await req.json();
    const stripe = getStripe();

    const line_items = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/en/checkout/success`,
      cancel_url: `${req.headers.get('origin')}/en/cart`,
      customer_email: customer.email,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU', 'JP', 'CN', 'FR', 'DE'] },
      metadata: { userId: user.id, customer_name: customer.name },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
