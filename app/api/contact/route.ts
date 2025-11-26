import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ContactBody = {
  name: string;
  email: string;
  organization?: string;
  message: string;
};

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;
    const { name, email, organization, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Read SMTP credentials from env
    // Expecting: GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_RECIPIENT
    const GMAIL_USER = getEnv('GMAIL_USER');
    const GMAIL_PASS = getEnv('GMAIL_APP_PASSWORD');
    const CONTACT_RECIPIENT = process.env.CONTACT_RECIPIENT || GMAIL_USER;

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS, // App password recommended
      },
    });

    const html = `
      <div style="font-family: sans-serif; background-color: #F8FAFC; padding: 40px 20px; color: #0F172A;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 4px; overflow: hidden;">
          <div style="background-color: #0F172A; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-family: sans-serif; letter-spacing: -0.02em; font-size: 24px;">GUNUNG</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="margin-top: 0; color: #2F7939; font-size: 20px; font-weight: bold; margin-bottom: 8px;">New Contact Message</h2>
            <p style="color: #64748B; font-size: 14px; margin-bottom: 24px; margin-top: 0;">You received a new message from your website contact form.</p>
            
            <div style="background-color: #F1F5F9; padding: 20px; border-radius: 4px; margin-bottom: 24px; border: 1px solid #E2E8F0;">
              <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #2F7939; text-decoration: none;">${escapeHtml(email)}</a></p>
              <p style="margin: 0; font-size: 14px;"><strong>Organization:</strong> ${escapeHtml(organization || 'N/A')}</p>
            </div>

            <div style="border-left: 4px solid #2F7939; padding-left: 16px; margin-bottom: 24px;">
              <p style="margin: 0; line-height: 1.6; color: #334155;">${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
            </div>
            
            <p style="font-size: 12px; color: #94A3B8; margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: center;">
              Sent from Gunung Web Contact Form
            </p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: CONTACT_RECIPIENT,
      subject: `New message from ${name} — Gunung contact form`,
      text: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization || 'N/A'}\n\n${message}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API Error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

function escapeHtml(unsafe: string) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
