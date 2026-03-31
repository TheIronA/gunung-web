import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';
import { verifyAuth } from '@/app/admin/actions';
import Stripe from 'stripe';

/**
 * One-time backfill: fetches actual Stripe fees for all existing orders
 * and updates the stripe_fee column. Hit GET /api/backfill-stripe-fees
 * while logged in as admin. Safe to run multiple times.
 */
export async function GET() {
  const isAuth = await verifyAuth();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  // Fetch all online orders that still have stripe_fee = 0 and have a stripe session
  const { data: orders, error } = await (supabase
    .from('orders' as any) as any)
    .select('id, stripe_session_id, stripe_payment_intent_id')
    .eq('stripe_fee', 0)
    .not('stripe_session_id', 'is', null);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch orders', details: error }, { status: 500 });
  }

  const results: { id: string; fee: number; status: string }[] = [];

  for (const order of (orders || [])) {
    try {
      // Try to get the session first — this gives us the payment intent
      let paymentIntentId = order.stripe_payment_intent_id;

      if (!paymentIntentId && order.stripe_session_id) {
        try {
          const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
          paymentIntentId = session.payment_intent as string | null;
        } catch {
          results.push({ id: order.id, fee: 0, status: 'session_not_found' });
          continue;
        }
      }

      if (!paymentIntentId) {
        results.push({ id: order.id, fee: 0, status: 'no_payment_intent' });
        continue;
      }

      // Expand through to the balance transaction to get the fee
      let fee = 0;
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
          expand: ['latest_charge.balance_transaction'],
        });
        const charge = paymentIntent.latest_charge as Stripe.Charge | null;
        const balanceTx = charge?.balance_transaction as Stripe.BalanceTransaction | null;
        fee = balanceTx?.fee ?? 0;
      } catch {
        // Payment intent not accessible with current key (test/live mismatch)
        // Try fetching charges for this payment intent directly
        try {
          const charges = await stripe.charges.list({ payment_intent: paymentIntentId, limit: 1 });
          if (charges.data.length > 0) {
            const charge = charges.data[0];
            if (typeof charge.balance_transaction === 'string') {
              const bt = await stripe.balanceTransactions.retrieve(charge.balance_transaction);
              fee = bt.fee;
            } else if (charge.balance_transaction) {
              fee = charge.balance_transaction.fee;
            }
          }
        } catch {
          results.push({ id: order.id, fee: 0, status: 'pi_not_found_with_current_key' });
          continue;
        }
      }

      if (fee > 0) {
        await (supabase
          .from('orders' as any) as any)
          .update({ stripe_fee: fee } as any)
          .eq('id', order.id);
        results.push({ id: order.id, fee, status: 'updated' });
      } else {
        results.push({ id: order.id, fee: 0, status: 'fee_was_zero' });
      }
    } catch (e: any) {
      results.push({ id: order.id, fee: 0, status: `error: ${e.message}` });
    }
  }

  return NextResponse.json({
    total: results.length,
    updated: results.filter((r) => r.status === 'updated').length,
    skipped: results.filter((r) => r.status === 'pi_not_found_with_current_key').length,
    results,
  });
}
