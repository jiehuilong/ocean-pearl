let stripeInstance = null;

export function getStripe() {
  if (!stripeInstance) {
    const { default: Stripe } = require('stripe');
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}

export function getStripePublicKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}
