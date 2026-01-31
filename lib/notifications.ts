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
      <td style="padding: 16px 12px; border-bottom: 2px solid #E8F5E9;">
        <strong style="color: #0F172A; font-size: 15px;">${escapeHtml(item.name)}</strong>
        ${item.size ? `<br/><span style="color: #64748B; font-size: 13px;">Size: ${escapeHtml(item.size)}</span>` : ''}
      </td>
      <td style="padding: 16px 12px; border-bottom: 2px solid #E8F5E9; text-align: center; color: #0F172A;">
        ×${item.quantity}
      </td>
      <td style="padding: 16px 12px; border-bottom: 2px solid #E8F5E9; text-align: right; font-family: 'Monaco', 'Courier New', monospace; font-weight: 600; color: #0F172A;">
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
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F1F5F9; color: #0F172A;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

        <!-- Header with Mountain Theme -->
        <div style="background: linear-gradient(135deg, #2F7939 0%, #1D5128 100%); padding: 48px 32px; text-align: center; position: relative; overflow: hidden;">
          <!-- Mountain SVG Background Pattern -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; opacity: 0.1;">
            <svg viewBox="0 0 1200 120" style="width: 100%; height: 80px;">
              <path fill="#ffffff" d="M0,0 L300,80 L600,20 L900,70 L1200,10 L1200,120 L0,120 Z"/>
              <path fill="#ffffff" d="M0,20 L250,90 L500,40 L800,85 L1200,30 L1200,120 L0,120 Z" opacity="0.5"/>
            </svg>
          </div>

          <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 32px; font-weight: 800; letter-spacing: -0.03em; position: relative; z-index: 1;">
            🏔️ Gunung
          </h1>
          <p style="color: rgba(255, 255, 255, 0.95); margin: 0; font-size: 16px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; position: relative; z-index: 1;">
            Order Confirmed
          </p>
        </div>

        <!-- Success Message -->
        <div style="background: linear-gradient(to right, #ECFDF5, #F0FDF4); border-left: 4px solid #2F7939; padding: 24px 32px; margin: 24px 32px;">
          <div style="display: flex; align-items: center;">
            <div style="background-color: #2F7939; color: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; margin-right: 16px;">
              ✓
            </div>
            <div>
              <h2 style="margin: 0 0 4px 0; color: #0F172A; font-size: 20px; font-weight: 700;">
                Ready to Ascend!
              </h2>
              <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.5;">
                Your order is confirmed. We'll send you tracking details once your gear ships out.
              </p>
            </div>
          </div>
        </div>

        <!-- Greeting -->
        <div style="padding: 8px 32px 24px 32px;">
          <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Hey <strong>${escapeHtml(data.customerName || 'Climber')}</strong>,
          </p>
          <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6; color: #334155;">
            Thanks for choosing Gunung! Your climbing gear is being prepared for the journey ahead.
          </p>
        </div>

        <!-- Order Summary Box -->
        <div style="margin: 0 32px 32px 32px; background: linear-gradient(to bottom, #FAFAFA, #F5F5F5); border: 3px solid #0F172A; border-radius: 8px; box-shadow: 6px 6px 0px rgba(15, 23, 42, 0.15); overflow: hidden;">
          <div style="background-color: #0F172A; padding: 16px 20px;">
            <h3 style="margin: 0; color: #ffffff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
              Order Summary
            </h3>
          </div>

          <div style="padding: 20px;">
            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px dashed #CBD5E1;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #64748B; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</span>
                <strong style="color: #0F172A; font-size: 14px; font-family: monospace;">
                  #${data.orderId ? data.orderId.substring(0, 8).toUpperCase() : 'PENDING'}
                </strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748B; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                <span style="color: #0F172A; font-size: 14px;">${escapeHtml(data.customerEmail)}</span>
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #F8FAFC;">
                  <th style="padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748B; letter-spacing: 0.5px; font-weight: 600;">
                    Item
                  </th>
                  <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #64748B; letter-spacing: 0.5px; font-weight: 600;">
                    Qty
                  </th>
                  <th style="padding: 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #64748B; letter-spacing: 0.5px; font-weight: 600;">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background: linear-gradient(135deg, #2F7939, #1D5128);">
                  <td colspan="2" style="padding: 20px 12px; color: #ffffff; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Total
                  </td>
                  <td style="padding: 20px 12px; text-align: right; font-family: 'Monaco', 'Courier New', monospace; font-weight: 800; font-size: 20px; color: #ffffff;">
                    ${formatCurrency(data.totalAmount, data.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Shipping Info -->
        ${data.shippingAddress ? `
        <div style="padding: 0 32px 32px 32px;">
          <h3 style="margin: 0 0 16px 0; color: #0F172A; font-size: 18px; font-weight: 700;">
            📦 Shipping To
          </h3>
          <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 6px; padding: 20px;">
            <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.8;">
              ${escapeHtml(formatAddress(data.shippingAddress))}
            </p>
          </div>
        </div>
        ` : ''}

        <!-- What's Next Section -->
        <div style="background: linear-gradient(to right, #FEF3C7, #FDE68A); padding: 28px 32px; margin: 0 32px 32px 32px; border-radius: 8px; border: 2px solid #F59E0B;">
          <h3 style="margin: 0 0 12px 0; color: #92400E; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
            <span style="margin-right: 8px;">⛰️</span> What's Next?
          </h3>
          <ol style="margin: 0; padding-left: 20px; color: #78350F; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">We're preparing your order for shipment</li>
            <li style="margin-bottom: 8px;">You'll receive tracking details within 1-2 business days</li>
            <li style="margin-bottom: 0;">Get ready to hit the crags! 🧗</li>
          </ol>
        </div>

        <!-- Support Section -->
        <div style="padding: 0 32px 40px 32px; text-align: center;">
          <p style="margin: 0 0 16px 0; color: #64748B; font-size: 14px;">
            Questions about your order? We're here to help!
          </p>
          <a href="mailto:${EMAIL_USER}" style="display: inline-block; background-color: #2F7939; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; border: 3px solid #0F172A; box-shadow: 4px 4px 0px rgba(15, 23, 42, 0.15); transition: all 0.2s;">
            Contact Support
          </a>
        </div>

        <!-- Footer -->
        <div style="background-color: #0F172A; padding: 32px; text-align: center;">
          <p style="margin: 0 0 12px 0; color: #94A3B8; font-size: 13px; line-height: 1.6;">
            <strong style="color: #ffffff; font-size: 16px; display: block; margin-bottom: 8px;">Gunung</strong>
            Gear designed for the Malaysian ascent.<br/>
            Ascend to the peak.
          </p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #334155;">
            <p style="margin: 0; color: #64748B; font-size: 11px;">
              © ${new Date().getFullYear()} Gunung Store. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;

  const plainText = `
🏔️ GUNUNG - ORDER CONFIRMED

Hey ${data.customerName || 'Climber'},

Thanks for choosing Gunung! Your order is confirmed and we're getting your gear ready.

ORDER DETAILS
Order ID: #${data.orderId ? data.orderId.substring(0, 8).toUpperCase() : 'PENDING'}
Email: ${data.customerEmail}

ITEMS
${data.items.map(item => `- ${item.name}${item.size ? ` (Size: ${item.size})` : ''} × ${item.quantity} - ${formatCurrency(item.unitPrice, data.currency)}`).join('\n')}

TOTAL: ${formatCurrency(data.totalAmount, data.currency)}

${data.shippingAddress ? `SHIPPING TO:\n${formatAddress(data.shippingAddress)}\n\n` : ''}WHAT'S NEXT?
1. We're preparing your order for shipment
2. You'll receive tracking details within 1-2 business days
3. Get ready to hit the crags! 🧗

Questions? Reply to this email or contact us at ${EMAIL_USER}

---
Gunung - Gear designed for the Malaysian ascent
© ${new Date().getFullYear()} Gunung Store. All rights reserved.
  `.trim();

  try {
    await transporter.sendMail({
      from: `Gunung 🏔️ <${EMAIL_USER}>`,
      to: data.customerEmail,
      subject: `Order Confirmed! 🏔️ Your climbing gear is on the way`,
      text: plainText,
      html,
    });

    console.log(`Customer confirmation email sent to ${data.customerEmail}`);
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
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
