import nodemailer from 'nodemailer';

const GUNUNG_LOGO_BASE64 = 'data:image/png;base64,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';

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
                <img src="${GUNUNG_LOGO_BASE64}" alt="Gunung logo" width="36" height="36" style="display: block; border: 0; border-radius: 4px;" />
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
                <img src="${GUNUNG_LOGO_BASE64}" alt="Gunung logo" width="36" height="36" style="display: block; border: 0; border-radius: 4px;" />
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
