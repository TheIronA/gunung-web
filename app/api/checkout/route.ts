import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProduct, checkStock } from '@/lib/products';
import { getShippingRate } from '@/lib/shipping';
import { getRegionalPriceData } from '@/lib/price-helpers';
import type { Region } from '@/lib/region-context';

interface CheckoutItem {
  id: string;
  quantity: number;
  size?: string;
}

interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, shippingRateId, region: regionRaw } = body as {
      items: CheckoutItem[];
      shippingAddress: ShippingAddress;
      shippingRateId: string;
      region?: string;
    };

    const region: Region = 
      regionRaw === 'ID' ? 'ID' : 
      regionRaw === 'SG' ? 'SG' : 
      regionRaw === 'PH' ? 'PH' : 'MY';
    const country = shippingAddress.country || (
      region === 'ID' ? 'ID' : 
      region === 'SG' ? 'SG' : 
      region === 'PH' ? 'PH' : 'MY'
    );

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    if (!shippingAddress || !shippingRateId) {
      return NextResponse.json({ error: 'Shipping information required' }, { status: 400 });
    }

    if (!stripe) {
      console.error('Stripe is not configured (STRIPE_SECRET_KEY missing)');
      return NextResponse.json(
        { error: 'Payment system is currently unavailable' },
        { status: 503 }
      );
    }

    // Validate shipping rate
    const shippingRate = getShippingRate(shippingRateId, shippingAddress.state, country);
    if (!shippingRate) {
      return NextResponse.json({ error: 'Invalid shipping rate' }, { status: 400 });
    }

    const currency = 
      region === 'ID' ? 'idr' : 
      region === 'SG' ? 'sgd' : 
      region === 'PH' ? 'php' : 'myr';

    // Check stock and map items
    const lineItems = await Promise.all(
      items.map(async (item: CheckoutItem) => {
        const product = await getProduct(item.id);

        if (!product) {
          throw new Error(`Product with ID ${item.id} not found`);
        }

        // Check stock if size is specified
        if (item.size) {
          const stock = await checkStock(item.id, item.size);
          if (stock < item.quantity) {
            throw new Error(
              `Insufficient stock for ${product.name} (${item.size}). Only ${stock} available.`
            );
          }
        }

        const productName = item.size
          ? `${product.name} - ${item.size}`
          : product.name;

        // Get regional price
        const { priceData } = getRegionalPriceData(product, region);

        // For IDR, amount is whole rupiah. For MYR, amount is in cents.
        // Stripe expects smallest currency unit:
        // - MYR: cents (already stored as cents)
        // - IDR: whole rupiah (IDR has no subunit, 1 IDR = 1 smallest unit)
        const unitAmount = Math.round(priceData.currentPrice);

        return {
          price_data: {
            currency,
            product_data: {
              name: productName,
              description: product.description,
              metadata: {
                product_id: product.id,
                size: item.size || '',
              },
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };
      })
    );

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency,
        product_data: {
          name: shippingRate.name,
          description: `${shippingRate.description} - ${shippingRate.estimatedDays}`,
          metadata: {
            product_id: 'shipping',
            size: '',
          },
        },
        unit_amount: shippingRate.rate,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/store?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/store?canceled=true`,
      customer_email: shippingAddress.email,
      customer_creation: 'always',
      metadata: {
        region,
        shipping_name: shippingAddress.name,
        shipping_phone: shippingAddress.phone,
        shipping_line1: shippingAddress.line1,
        shipping_line2: shippingAddress.line2 || '',
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state,
        shipping_postal_code: shippingAddress.postalCode,
        shipping_country: country,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
