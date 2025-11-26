import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { products } from '@/lib/products';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    if (!stripe) {
      console.error('Stripe is not configured (STRIPE_SECRET_KEY missing)');
      return NextResponse.json(
        { error: 'Payment system is currently unavailable' },
        { status: 503 }
      );
    }

    // Map the requested items to our product data to ensure price integrity
    const lineItems = items.map((item: { id: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.id);
      
      if (!product) {
        throw new Error(`Product with ID ${item.id} not found`);
      }

      return {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
            // images: [product.image], // Uncomment when you have real images hosted
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/store?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/store?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
