const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.log(`[EMAIL] Would send to ${to}: ${subject}`);
    return { id: 'dev-mode' };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({ from: FROM, to, subject, html });
    console.log(`[EMAIL] Sent to ${to}: ${subject} (${result.id})`);
    return result;
  } catch (err) {
    console.error(`[EMAIL] Failed to send to ${to}:`, err);
    return null;
  }
}

// --- Templates ---

export function orderConfirmationEmail({ name, orderId, items, total }) {
  const itemsHtml = items.map(i =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.productName}</td><td style="padding:8px 0;border-bottom:1px solid #eee">${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">$${i.price.toLocaleString()}</td></tr>`
  ).join('');

  return {
    subject: `Order Confirmed — #${orderId.slice(0, 8)}`,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:sans-serif">
        <h1 style="color:#1a3a4a">Thank you, ${name}!</h1>
        <p style="color:#555">Your order has been confirmed and is being processed.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <thead><tr style="background:#f5f0eb">
            <th style="padding:8px;text-align:left">Item</th><th style="padding:8px;text-align:left">Qty</th><th style="padding:8px;text-align:right">Price</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="font-size:18px;font-weight:bold;color:#c9a96e;text-align:right">Total: $${total.toLocaleString()}</p>
        <p style="color:#555">You can track your order status in your account.</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <p style="color:#999;font-size:12px">Ocean Pearl — Natural pearls from the world's purest waters</p>
      </div>`,
  };
}

export function passwordResetEmail({ token, email }) {
  const url = `${SITE_URL}/en/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  return {
    subject: 'Reset Your Password',
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:sans-serif">
        <h1 style="color:#1a3a4a">Password Reset</h1>
        <p style="color:#555">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${url}" style="display:inline-block;background:#1a3a4a;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:20px 0">Reset Password</a>
        <p style="color:#999;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>`,
  };
}

export function adminNewOrderNotification({ name, orderId, total }) {
  return {
    subject: `🛒 New Order — #${orderId.slice(0, 8)} ($${total.toLocaleString()})`,
    html: `<p>New order from <strong>${name}</strong> — $${total.toLocaleString()}</p><p><a href="${SITE_URL}/en/admin/orders/${orderId}" style="color:#c9a96e">View Order</a></p>`,
  };
}
