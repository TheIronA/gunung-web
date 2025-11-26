import Stripe from 'stripe';

// Don't crash the build if the key is missing, just don't export a valid instance
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia', // Use the latest API version or the one you prefer
      typescript: true,
    })
  : (null as unknown as Stripe);
