import nodemailer from 'nodemailer';
import path from 'path';

const GUNUNG_LOGO_PATH = path.join(process.cwd(), 'public', 'gunung-logo-compressed.png');
const GUNUNG_LOGO_CID = 'gununglogo@gunung';

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
  const code = currency.toUpperCase();
  // IDR is a zero-decimal currency (Stripe sends whole rupiah)
  if (code === 'IDR') {
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return (amount / 100).toLocaleString('en-MY', {
    style: 'currency',
    currency: code,
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
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || EMAIL_USER;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.error('Email credentials not configured, skipping notification');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
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
      from: `Gunung Store <${EMAIL_USER}>`,
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

// Send customer order confirmation email
export async function sendCustomerOrderConfirmation(data: OrderNotificationData): Promise<void> {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.error('Email credentials not configured, skipping customer confirmation');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 14px 12px; border-bottom: 1px solid #E2E8F0;">
        <span style="color: #0F172A; font-size: 14px; font-weight: 600;">${escapeHtml(item.name)}</span>
        ${item.size ? `<br/><span style="color: #94A3B8; font-size: 12px; margin-top: 2px; display: inline-block;">Size: ${escapeHtml(item.size)}</span>` : ''}
      </td>
      <td style="padding: 14px 12px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #64748B; font-size: 14px;">
        x${item.quantity}
      </td>
      <td style="padding: 14px 12px; border-bottom: 1px solid #E2E8F0; text-align: right; font-family: 'Courier New', monospace; font-size: 14px; font-weight: 600; color: #0F172A;">
        ${formatCurrency(item.unitPrice, data.currency)}
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; color: #0F172A;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E2E8F0;">

        <!-- Header -->
        <div style="background-color: #0F172A; padding: 28px 40px; border-bottom: 4px solid #2F7939;">
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="vertical-align: middle; width: 44px; padding-right: 14px;">
                <img src="cid:${GUNUNG_LOGO_CID}" alt="Gunung logo" width="36" height="36" style="display: block; border: 0; border-radius: 4px;" />
              </td>
              <td style="vertical-align: middle;">
                <p style="margin: 0 0 3px 0; color: #64748B; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500;">Order Confirmed</p>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Gunung</h1>
              </td>
            </tr>
          </table>
        </div>

        <!-- Status bar -->
        <div style="background-color: #F0FDF4; border-bottom: 1px solid #BBF7D0; padding: 14px 40px;">
          <table style="border-collapse: collapse;">
            <tr>
              <td style="vertical-align: middle; padding-right: 10px; width: 24px;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #2F7939; border-radius: 50%; text-align: center; line-height: 20px; color: #ffffff; font-size: 12px; font-weight: 700;">&#10003;</span>
              </td>
              <td style="vertical-align: middle;">
                <span style="color: #166534; font-size: 14px; font-weight: 500;">Payment received &mdash; your order is confirmed.</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body -->
        <div style="padding: 36px 40px;">
          <p style="margin: 0 0 6px 0; font-size: 18px; font-weight: 600; color: #0F172A;">Hi ${escapeHtml(data.customerName || 'there')},</p>
          <p style="margin: 0 0 32px 0; font-size: 15px; color: #64748B; line-height: 1.6;">
            Thanks for your order. We&rsquo;ll send you a tracking number once your gear ships out, typically within 1&ndash;2 business days.
          </p>

          <!-- Order meta -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #94A3B8; width: 50%;">Order</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; font-family: 'Courier New', monospace; font-weight: 600; color: #0F172A; text-align: right;">
                #${data.orderId ? data.orderId.substring(0, 8).toUpperCase() : 'PENDING'}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #94A3B8;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; color: #0F172A; text-align: right;">${escapeHtml(data.customerEmail)}</td>
            </tr>
          </table>

          <!-- Items -->
          <p style="margin: 0 0 12px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">Items Ordered</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
            <thead>
              <tr style="border-bottom: 2px solid #0F172A;">
                <th style="padding: 8px 12px 10px 0; text-align: left; font-size: 12px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                <th style="padding: 8px 12px 10px; text-align: center; font-size: 12px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                <th style="padding: 8px 0 10px; text-align: right; font-size: 12px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="border-top: 2px solid #0F172A;">
                <td colspan="2" style="padding: 14px 12px 0 0; font-size: 14px; font-weight: 700; color: #0F172A;">Total</td>
                <td style="padding: 14px 0 0; text-align: right; font-family: 'Courier New', monospace; font-size: 16px; font-weight: 700; color: #2F7939;">${formatCurrency(data.totalAmount, data.currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Shipping -->
        ${data.shippingAddress ? `
        <div style="border-top: 1px solid #E2E8F0; padding: 24px 40px;">
          <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">Shipping To</p>
          <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.7;">${escapeHtml(formatAddress(data.shippingAddress))}</p>
        </div>
        ` : ''}

        <!-- What's next -->
        <div style="border-top: 1px solid #E2E8F0; padding: 24px 40px;">
          <p style="margin: 0 0 14px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">What Happens Next</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top; padding-bottom: 12px; width: 28px;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #0F172A; border-radius: 50%; text-align: center; line-height: 20px; color: #ffffff; font-size: 11px; font-weight: 700;">1</span>
              </td>
              <td style="vertical-align: top; padding-bottom: 12px; padding-left: 10px; font-size: 14px; color: #334155;">We pack and prepare your order for dispatch.</td>
            </tr>
            <tr>
              <td style="vertical-align: top; padding-bottom: 12px; width: 28px;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #0F172A; border-radius: 50%; text-align: center; line-height: 20px; color: #ffffff; font-size: 11px; font-weight: 700;">2</span>
              </td>
              <td style="vertical-align: top; padding-bottom: 12px; padding-left: 10px; font-size: 14px; color: #334155;">You&rsquo;ll receive a tracking number by email within 1&ndash;2 business days.</td>
            </tr>
            <tr>
              <td style="vertical-align: top; width: 28px;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #2F7939; border-radius: 50%; text-align: center; line-height: 20px; color: #ffffff; font-size: 11px; font-weight: 700;">3</span>
              </td>
              <td style="vertical-align: top; padding-left: 10px; font-size: 14px; color: #334155;">Your gear arrives. Time to climb.</td>
            </tr>
          </table>
        </div>

        <!-- Support -->
        <div style="border-top: 1px solid #E2E8F0; padding: 24px 40px;">
          <p style="margin: 0; font-size: 14px; color: #64748B;">
            Questions? Reply to this email or write to
            <a href="mailto:${EMAIL_USER}" style="color: #2F7939; text-decoration: none; font-weight: 500;">${EMAIL_USER}</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 24px 40px;">
          <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #0F172A;">Gunung</p>
          <p style="margin: 0; font-size: 12px; color: #94A3B8;">
            &copy; ${new Date().getFullYear()} Gunung Store &mdash; Gear for the Malaysian ascent.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  const plainText = `
GUNUNG — ORDER CONFIRMED

Hi ${data.customerName || 'there'},

Thanks for your order. We'll send you a tracking number once your gear ships out.

ORDER: #${data.orderId ? data.orderId.substring(0, 8).toUpperCase() : 'PENDING'}
EMAIL: ${data.customerEmail}

ITEMS
${data.items.map(item => `- ${item.name}${item.size ? ` (Size: ${item.size})` : ''} x${item.quantity}  ${formatCurrency(item.unitPrice, data.currency)}`).join('\n')}

TOTAL: ${formatCurrency(data.totalAmount, data.currency)}

${data.shippingAddress ? `SHIPPING TO:\n${formatAddress(data.shippingAddress)}\n\n` : ''}Questions? Reply to this email or write to ${EMAIL_USER}

—
Gunung Store  |  ${new Date().getFullYear()}
  `.trim();

  try {
    await transporter.sendMail({
      from: `Gunung Store <${EMAIL_USER}>`,
      to: data.customerEmail,
      subject: `Order Confirmed! Your climbing gear is on the way`,
      text: plainText,
      html,
      attachments: [{ filename: 'gunung-logo.png', path: GUNUNG_LOGO_PATH, cid: GUNUNG_LOGO_CID }],
    });

    console.log(`Customer confirmation email sent to ${data.customerEmail}`);
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
    throw error;
  }
}

// Send tracking number update to customer
export async function sendTrackingNotification(data: {
  customerEmail: string;
  customerName: string | null;
  trackingNumber: string;
  orderId: string;
}): Promise<void> {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.error('Email credentials not configured, skipping tracking notification');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; color: #0F172A;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E2E8F0;">

        <!-- Header -->
        <div style="background-color: #0F172A; padding: 28px 40px; border-bottom: 4px solid #2F7939;">
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="vertical-align: middle; width: 44px; padding-right: 14px;">
                <img src="cid:${GUNUNG_LOGO_CID}" alt="Gunung logo" width="36" height="36" style="display: block; border: 0; border-radius: 4px;" />
              </td>
              <td style="vertical-align: middle;">
                <p style="margin: 0 0 3px 0; color: #64748B; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500;">Your Order Has Shipped</p>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Gunung</h1>
              </td>
            </tr>
          </table>
        </div>

        <!-- Status bar -->
        <div style="background-color: #EFF6FF; border-bottom: 1px solid #BFDBFE; padding: 14px 40px;">
          <table style="border-collapse: collapse;">
            <tr>
              <td style="vertical-align: middle; padding-right: 10px; width: 24px;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #1D4ED8; border-radius: 50%; text-align: center; line-height: 20px; color: #ffffff; font-size: 11px; font-weight: 700;">&#8599;</span>
              </td>
              <td style="vertical-align: middle;">
                <span style="color: #1E3A8A; font-size: 14px; font-weight: 500;">Your gear is on its way.</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body -->
        <div style="padding: 36px 40px;">
          <p style="margin: 0 0 6px 0; font-size: 18px; font-weight: 600; color: #0F172A;">Hi ${escapeHtml(data.customerName || 'there')},</p>
          <p style="margin: 0 0 32px 0; font-size: 15px; color: #64748B; line-height: 1.6;">
            Your order has been dispatched. Use the tracking number below to follow your parcel.
          </p>

          <!-- Tracking number box -->
          <div style="border: 2px solid #0F172A; padding: 24px 28px; margin-bottom: 28px;">
            <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94A3B8; font-weight: 600;">Tracking Number</p>
            <p style="margin: 0 0 10px 0; font-size: 24px; font-family: 'Courier New', monospace; font-weight: 700; color: #0F172A; letter-spacing: 0.05em;">${escapeHtml(data.trackingNumber)}</p>
            <p style="margin: 0; font-size: 12px; color: #94A3B8;">Order #${data.orderId.substring(0, 8).toUpperCase()}</p>
          </div>

          <!-- Delivery info -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 0;">
            <tr>
              <td style="vertical-align: top; padding-bottom: 14px; width: 28px;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #0F172A; border-radius: 50%; text-align: center; line-height: 20px; color: #ffffff; font-size: 11px; font-weight: 700;">1</span>
              </td>
              <td style="vertical-align: top; padding-bottom: 14px; padding-left: 12px; font-size: 14px; color: #334155;">Use your tracking number with the courier&rsquo;s website to follow your parcel.</td>
            </tr>
            <tr>
              <td style="vertical-align: top; padding-bottom: 14px; width: 28px;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #0F172A; border-radius: 50%; text-align: center; line-height: 20px; color: #ffffff; font-size: 11px; font-weight: 700;">2</span>
              </td>
              <td style="vertical-align: top; padding-bottom: 14px; padding-left: 12px; font-size: 14px; color: #334155;">Delivery typically takes 1&ndash;5 business days depending on your location.</td>
            </tr>
            <tr>
              <td style="vertical-align: top; width: 28px;">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: #2F7939; border-radius: 50%; text-align: center; line-height: 20px; color: #ffffff; font-size: 11px; font-weight: 700;">3</span>
              </td>
              <td style="vertical-align: top; padding-left: 12px; font-size: 14px; color: #334155;">Gear arrives. Head to the crag.</td>
            </tr>
          </table>
        </div>

        <!-- Support -->
        <div style="border-top: 1px solid #E2E8F0; padding: 24px 40px;">
          <p style="margin: 0; font-size: 14px; color: #64748B;">
            Questions about your delivery? Reply to this email or write to
            <a href="mailto:${EMAIL_USER}" style="color: #2F7939; text-decoration: none; font-weight: 500;">${EMAIL_USER}</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 24px 40px;">
          <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #0F172A;">Gunung</p>
          <p style="margin: 0; font-size: 12px; color: #94A3B8;">
            &copy; ${new Date().getFullYear()} Gunung Store &mdash; Gear for the Malaysian ascent.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  const plainText = `
GUNUNG — YOUR ORDER HAS SHIPPED

Hi ${data.customerName || 'there'},

Your order has been dispatched. Use the tracking number below to follow your parcel.

TRACKING NUMBER: ${data.trackingNumber}
ORDER: #${data.orderId.substring(0, 8).toUpperCase()}

Delivery typically takes 1-5 business days.

Questions? Reply to this email or write to ${EMAIL_USER}

—
Gunung Store  |  ${new Date().getFullYear()}
  `.trim();

  try {
    await transporter.sendMail({
      from: `Gunung Store <${EMAIL_USER}>`,
      to: data.customerEmail,
      subject: `Your order has shipped! Tracking: ${data.trackingNumber}`,
      text: plainText,
      html,
      attachments: [{ filename: 'gunung-logo.png', path: GUNUNG_LOGO_PATH, cid: GUNUNG_LOGO_CID }],
    });

    console.log(`Tracking notification sent to ${data.customerEmail}`);
  } catch (error) {
    console.error('Failed to send tracking notification:', error);
    throw error;
  }
}

// Send low stock alert
export async function sendLowStockAlert(
  productName: string,
  size: string,
  currentStock: number
): Promise<void> {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  const ORDER_NOTIFICATION_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || EMAIL_USER;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.error('Email credentials not configured, skipping low stock alert');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
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
      from: `Gunung Store <${EMAIL_USER}>`,
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
