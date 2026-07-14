import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { db, uid } from '@/lib/db';

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  try {
    const buf = await req.arrayBuffer();
    const payload = Buffer.from(buf);

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      console.warn('STRIPE_WEBHOOK_SECRET not set — skipping signature verification');
    }

    const stripe = getStripe();
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      if (userId) {
        const orderId = uid();
        const shipping = JSON.stringify({
          name: session.shipping_details?.name || session.metadata?.customer_name || '',
          email: session.customer_email || '',
          address: session.shipping_details?.address?.line1 || '',
          city: session.shipping_details?.address?.city || '',
          country: session.shipping_details?.address?.country || '',
        });

        db.prepare('INSERT INTO orders (id, user_id, total, status, shipping, stripe_session_id) VALUES (?, ?, ?, ?, ?, ?)').run(
          orderId, userId, session.amount_total / 100, 'PAID', shipping, session.id
        );

        const insertItem = db.prepare('INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?, ?)');
        for (const item of lineItems.data) {
          insertItem.run(uid(), orderId, 'seed', item.description, item.price.unit_amount / 100, item.quantity);
        }

        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
        console.log(`Order ${orderId} created for user ${userId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
