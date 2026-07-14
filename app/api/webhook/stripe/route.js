import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { db, uid } from '@/lib/db';
import { sendEmail, orderConfirmationEmail, adminNewOrderNotification } from '@/lib/email';

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured — webhook disabled');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  try {
    const buf = await req.arrayBuffer();
    const payload = Buffer.from(buf);
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const itemsMeta = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
      const customerName = session.metadata?.customer_name || 'Customer';

      if (userId) {
        const orderId = uid();
        const shipping = JSON.stringify({
          name: session.shipping_details?.name || customerName,
          email: session.customer_email || '',
          address: session.shipping_details?.address?.line1 || '',
          city: session.shipping_details?.address?.city || '',
          country: session.shipping_details?.address?.country || '',
        });

        db.transaction(() => {
          db.prepare('INSERT INTO orders (id, user_id, total, status, shipping, stripe_session_id) VALUES (?, ?, ?, ?, ?, ?)').run(
            orderId, userId, session.amount_total / 100, 'PAID', shipping, session.id);

          const insertItem = db.prepare('INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?, ?)');
          for (const item of itemsMeta) {
            insertItem.run(uid(), orderId, item.productId || 'unknown', item.name, item.price, item.quantity);
            db.prepare('UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?').run(item.quantity, item.productId || '');
          }
        })();

        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

        // Send confirmation email
        const emailData = orderConfirmationEmail({ name: customerName, orderId, items: itemsMeta, total: session.amount_total / 100 });
        await sendEmail({ to: session.customer_email || '', ...emailData });

        // Notify admin
        const adminEmail = process.env.ADMIN_EMAIL || '';
        if (adminEmail) {
          const notif = adminNewOrderNotification({ name: customerName, orderId, total: session.amount_total / 100 });
          await sendEmail({ to: adminEmail, ...notif });
        }

        // Audit log
        db.prepare('INSERT INTO audit_log (id, user_id, action, details) VALUES (?, ?, ?, ?)').run(uid(), userId, 'order.paid', JSON.stringify({ orderId, total: session.amount_total / 100 }));

        console.log(`Order ${orderId} created for user ${userId}`);
      }
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object;
      const sessionId = charge.payment_intent?.toString() || '';
      const order = db.prepare("SELECT id FROM orders WHERE stripe_session_id LIKE ?").get(`%${sessionId}%`);
      if (order) {
        db.prepare("UPDATE orders SET status = 'CANCELLED', updated_at = datetime('now') WHERE id = ?").run(order.id);
        const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
        for (const item of items) {
          db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(item.quantity, item.product_id);
        }
        db.prepare('INSERT INTO audit_log (id, user_id, action, details) VALUES (?, ?, ?, ?)').run(uid(), 'system', 'order.refunded', JSON.stringify({ orderId: order.id }));
        console.log(`Order ${order.id} refunded, stock restored`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
