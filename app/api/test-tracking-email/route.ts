import { NextResponse } from 'next/server';
import { sendTrackingNotification, sendCustomerOrderConfirmation } from '@/lib/notifications';

// TEMPORARY — delete this file after testing
export async function GET() {
  const results: Record<string, string> = {};

  try {
    await sendCustomerOrderConfirmation({
      sessionId: 'test-session-id',
      orderId: 'abcdef12-test-order-id',
      customerEmail: 'mralwi3@gmail.com',
      customerName: 'Test Climber',
      totalAmount: 38900,
      currency: 'myr',
      items: [
        { name: 'Scarpa Drago', size: 'UK 8', quantity: 1, unitPrice: 38900 },
      ],
      shippingAddress: {
        line1: '123 Jalan Bukit',
        city: 'Kuala Lumpur',
        state: 'Selangor',
        postal_code: '50000',
        country: 'MY',
      },
    });
    results.confirmation = 'sent';
  } catch (e: any) {
    results.confirmation = `failed: ${e?.message}`;
  }

  try {
    await sendTrackingNotification({
      customerEmail: 'mralwi3@gmail.com',
      customerName: 'Test Climber',
      trackingNumber: 'MY1234567890',
      orderId: 'abcdef12-test-order-id',
    });
    results.tracking = 'sent';
  } catch (e: any) {
    results.tracking = `failed: ${e?.message}`;
  }

  return NextResponse.json({ ok: true, results });
}
