import Stripe from 'stripe';

// Don't crash the build if the key is missing, just don't export a valid instance
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  : (null as unknown as Stripe);
