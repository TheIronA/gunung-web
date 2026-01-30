import nodemailer from 'nodemailer';

interface OrderItem {
  name: string;
  size: string | null;
  quantity: number;
  unitPrice: number;
}

interface ShippingAddress {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
  [key: string]: string | null | undefined;
}

interface OrderNotificationData {
  sessionId: string;
  orderId?: string;
  customerEmail: string;
  customerName?: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress | Record<string, string> | null;
}

function formatCurrency(amount: number, currency: string): string {
  return (amount / 100).toLocaleString('en-MY', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
}

function formatAddress(address: ShippingAddress | null): string {
  if (!address) return 'Not provided';

  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ].filter(Boolean);

  return parts.join(', ') || 'Not provided';
}

function escapeHtml(unsafe: string): string {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendOrderNotification(data: OrderNotificationData): Promise<void> {
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD;
  const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || GMAIL_USER;

  if (!GMAIL_USER || !GMAIL_PASS) {
    console.error('Email credentials not configured, skipping notification');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #E2E8F0;">
        ${escapeHtml(item.name)}${item.size ? ` (${escapeHtml(item.size)})` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #E2E8F0; text-align: right; font-family: monospace;">
        ${formatCurrency(item.unitPrice, data.currency)}
      </td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: sans-serif; background-color: #F8FAFC; padding: 40px 20px; color: #0F172A;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #2F7939; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-family: sans-serif; letter-spacing: -0.02em; font-size: 24px;">
            New Order Received!
          </h1>
        </div>
        <div style="padding: 32px;">
          <div style="background-color: #ECFDF5; border: 1px solid #A7F3D0; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 16px; color: #047857; font-weight: bold;">
              Order ${data.orderId ? `#${data.orderId.substring(0, 8).toUpperCase()}` : 'Confirmed'}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #065F46;">
              ${formatCurrency(data.totalAmount, data.currency)} total
            </p>
          </div>

          <h2 style="margin-top: 0; color: #0F172A; font-size: 16px; font-weight: bold; margin-bottom: 16px;">
            Customer Details
          </h2>
          <div style="background-color: #F1F5F9; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; font-size: 14px;">
              <strong>Name:</strong> ${escapeHtml(data.customerName || 'Not provided')}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 14px;">
              <strong>Email:</strong>
              <a href="mailto:${escapeHtml(data.customerEmail)}" style="color: #2F7939;">
                ${escapeHtml(data.customerEmail)}
              </a>
            </p>
            <p style="margin: 0; font-size: 14px;">
              <strong>Shipping:</strong> ${escapeHtml(formatAddress(data.shippingAddress))}
            </p>
          </div>

          <h2 style="margin-top: 0; color: #0F172A; font-size: 16px; font-weight: bold; margin-bottom: 16px;">
            Order Items
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #F1F5F9;">
                <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748B;">
                  Product
                </th>
                <th style="padding: 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #64748B;">
                  Qty
                </th>
                <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #64748B;">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml || '<tr><td colspan="3" style="padding: 12px; text-align: center; color: #94A3B8;">No items found</td></tr>'}
            </tbody>
            <tfoot>
              <tr style="background-color: #0F172A; color: #ffffff;">
                <td colspan="2" style="padding: 12px; font-weight: bold;">Total</td>
                <td style="padding: 12px; text-align: right; font-family: monospace; font-weight: bold;">
                  ${formatCurrency(data.totalAmount, data.currency)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style="text-align: center; margin-top: 32px;">
            <a href="https://dashboard.stripe.com/payments"
               style="display: inline-block; background-color: #2F7939; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              View in Stripe Dashboard
            </a>
          </div>

          <p style="font-size: 12px; color: #94A3B8; margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: center;">
            Session ID: ${escapeHtml(data.sessionId)}<br/>
            Gunung Store Order Notification
          </p>
        </div>
      </div>
    </div>
  `;

  const plainText = `
NEW ORDER RECEIVED!

Order ${data.orderId ? `#${data.orderId.substring(0, 8).toUpperCase()}` : 'Confirmed'}
Total: ${formatCurrency(data.totalAmount, data.currency)}

CUSTOMER DETAILS
Name: ${data.customerName || 'Not provided'}
Email: ${data.customerEmail}
Shipping: ${formatAddress(data.shippingAddress)}

ORDER ITEMS
${data.items.map(item => `- ${item.name}${item.size ? ` (${item.size})` : ''} x${item.quantity} - ${formatCurrency(item.unitPrice, data.currency)}`).join('\n') || 'No items found'}

Session ID: ${data.sessionId}
  `.trim();

  try {
    await transporter.sendMail({
      from: `Gunung Store <${GMAIL_USER}>`,
      to: ORDER_NOTIFICATION_EMAIL,
      subject: `New Order! ${formatCurrency(data.totalAmount, data.currency)} from ${data.customerName || data.customerEmail}`,
      text: plainText,
      html,
    });

    console.log('Order notification sent successfully');
  } catch (error) {
    console.error('Failed to send order notification:', error);
  }
}

// Send low stock alert
export async function sendLowStockAlert(
  productName: string,
  size: string,
  currentStock: number
): Promise<void> {
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_PASS = process.env.GMAIL_APP_PASSWORD;
  const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || GMAIL_USER;

  if (!GMAIL_USER || !GMAIL_PASS) {
    console.error('Email credentials not configured, skipping low stock alert');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family: sans-serif; background-color: #F8FAFC; padding: 40px 20px; color: #0F172A;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden;">
        <div style="background-color: #DC2626; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-family: sans-serif; font-size: 24px;">
            Low Stock Alert
          </h1>
        </div>
        <div style="padding: 32px; text-align: center;">
          <p style="font-size: 18px; margin-bottom: 8px;">
            <strong>${escapeHtml(productName)}</strong>
          </p>
          <p style="font-size: 16px; color: #64748B; margin-bottom: 24px;">
            Size: ${escapeHtml(size)}
          </p>
          <div style="background-color: #FEF2F2; border: 1px solid #FECACA; padding: 24px; border-radius: 4px;">
            <p style="font-size: 48px; font-weight: bold; color: #DC2626; margin: 0;">
              ${currentStock}
            </p>
            <p style="font-size: 14px; color: #991B1B; margin: 8px 0 0 0;">
              items remaining
            </p>
          </div>
          <p style="font-size: 12px; color: #94A3B8; margin-top: 32px;">
            Consider restocking soon to avoid missed sales.
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `Gunung Store <${GMAIL_USER}>`,
      to: ORDER_NOTIFICATION_EMAIL,
      subject: `Low Stock: ${productName} (${size}) - ${currentStock} left`,
      text: `Low Stock Alert\n\nProduct: ${productName}\nSize: ${size}\nRemaining: ${currentStock}\n\nConsider restocking soon.`,
      html,
    });

    console.log('Low stock alert sent');
  } catch (error) {
    console.error('Failed to send low stock alert:', error);
  }
}
