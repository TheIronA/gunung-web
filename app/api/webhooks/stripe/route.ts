import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';
import { sendOrderNotification } from '@/lib/notifications';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    );
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

interface OrderData {
  id: string;
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const supabase = createServerClient();

  // Extract shipping address from metadata (collected on our checkout page)
  const metadata = session.metadata || {};
  const shippingAddress = metadata.shipping_line1 ? {
    line1: metadata.shipping_line1,
    line2: metadata.shipping_line2 || undefined,
    city: metadata.shipping_city,
    state: metadata.shipping_state,
    postal_code: metadata.shipping_postal_code,
  } : null;

  const customerName = metadata.shipping_name || session.customer_details?.name || null;
  const customerPhone = metadata.shipping_phone || null;

  if (!supabase) {
    console.error('Supabase not configured, cannot process order');
    // Still send notification via email
    await sendOrderNotification({
      sessionId: session.id,
      customerEmail: session.customer_details?.email || 'unknown',
      customerName: customerName || undefined,
      totalAmount: session.amount_total || 0,
      currency: session.currency || 'myr',
      items: [],
      shippingAddress: shippingAddress,
    });
    return;
  }

  try {
    // Get line items from the session
    const lineItems = await stripe!.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });

    // Create order in Supabase - using type assertion for database operations
    const orderInsert = {
      stripe_session_id: session.id,
      stripe_payment_intent_id: (session.payment_intent as string) || null,
      customer_email: session.customer_details?.email || 'unknown',
      customer_name: customerName,
      shipping_address: shippingAddress,
      total_amount: session.amount_total || 0,
      currency: session.currency || 'myr',
      status: 'paid' as const,
    };

    const { data: order, error: orderError } = await (supabase
      .from('orders') as ReturnType<typeof supabase.from>)
      .insert(orderInsert as never)
      .select()
      .single() as { data: OrderData | null; error: Error | null };

    if (orderError || !order) {
      console.error('Failed to create order:', orderError);
      throw orderError || new Error('No order returned');
    }

    // Process each line item
    const orderItems = [];
    for (const item of lineItems.data) {
      const productData = item.price?.product as Stripe.Product;
      const productId = productData?.metadata?.product_id || productData?.id || 'unknown';
      const size = productData?.metadata?.size || null;

      // Insert order item
      const orderItemInsert = {
        order_id: order.id,
        product_id: productId,
        product_name: item.description || 'Unknown Product',
        size: size,
        quantity: item.quantity || 1,
        unit_price: item.price?.unit_amount || 0,
      };

      const { error: itemError } = await (supabase
        .from('order_items') as ReturnType<typeof supabase.from>)
        .insert(orderItemInsert as never) as { error: Error | null };

      if (itemError) {
        console.error('Failed to create order item:', itemError);
      }

      // Decrease stock if size is specified
      if (size && productId !== 'unknown') {
        const { error: stockError } = await supabase.rpc('decrease_stock', {
          p_product_id: productId,
          p_size: size,
          p_quantity: item.quantity || 1,
        } as never) as { error: Error | null };

        if (stockError) {
          console.error('Failed to decrease stock:', stockError);
        }
      }

      orderItems.push({
        name: item.description || 'Unknown Product',
        size: size,
        quantity: item.quantity || 1,
        unitPrice: item.price?.unit_amount || 0,
      });
    }

    // Send notification email
    await sendOrderNotification({
      sessionId: session.id,
      orderId: order.id,
      customerEmail: session.customer_details?.email || 'unknown',
      customerName: customerName || undefined,
      totalAmount: session.amount_total || 0,
      currency: session.currency || 'myr',
      items: orderItems,
      shippingAddress: shippingAddress,
    });

    console.log('Order processed successfully:', order.id);
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw error;
  }
}
